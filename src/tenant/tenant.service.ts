import { HttpService, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Occupant } from './tenant.schema';
import { LoggerService } from '@tenant/logger';
import { CreateOccupantDto, UpdateOccupantDto } from './dto';
import { ClientKafka } from '@nestjs/microservices';
import { ConfigService } from '@tenant/config';
import { v4 as uuid } from 'uuid';
import { ExtendedRequest } from '@tenant/auth';
import { BillingOccupant, RoomMinMaxMeterValue } from './tenant.interface';
import { forkJoin } from 'rxjs';
import { take, tap } from 'rxjs/operators';

@Injectable()
export class TenantService {
  constructor(@InjectModel('Occupant') private readonly model: Model<Occupant>,
              @Inject('KAFKA_SERVICE') private kafkaClient: ClientKafka,
              private readonly httpService: HttpService,
              private readonly config: ConfigService,
              private readonly logger: LoggerService) {}

  async findAll(): Promise<Occupant[]> {
    this.logger.debug(`TenantService - get all occupants`);
    return this.model.find().exec();
  }

  async findOne(id: string): Promise<Occupant> {
    this.logger.debug(`TenantService - get Occupant ${id}`);
    return this.model.findById(id);
  }

  async createOne(dto: CreateOccupantDto): Promise<Occupant> {
    this.logger.debug(`TenantService - Create Occupant`);
    const doc = await this.model.create(dto);

    this.kafkaClient.emit(`${this.config.getKafka().prefix}-device-pull-event`, {
      id: uuid(),
      type: 'event',
      action: 'PullStateChangeDevice',
      timestamp: Date.now(),
      data: {
        flatId: dto.flat,
        pull: true
      },
    });

    this.kafkaClient.emit(`${this.config.getKafka().prefix}-flat-occupied-event`, {
      id: uuid(),
      type: 'event',
      action: 'FlatOccupied',
      timestamp: Date.now(),
      data: {
        flatId: dto.flat,
        occupied: true
      },
    });

    return doc;
  }

  async updateOne(id: string, dto: UpdateOccupantDto): Promise<Occupant> {
    this.logger.debug(`TenantService - update occupant`);
    const doc = await this.model.findById(id).exec();
    if (!doc) {
      throw new NotFoundException();
    }
    await this.model.findOneAndUpdate({ _id: new Types.ObjectId(id) }, { $set: dto }, { new: true }).exec();

    if (dto.flat) {
      this.kafkaClient.emit(`${this.config.getKafka().prefix}-device-pull-event`, {
        id: uuid(),
        type: 'event',
        action: 'PullStateChangeDevice',
        timestamp: Date.now(),
        data: {
          flatId: doc.flat,
          pull: false
        },
      });

      this.kafkaClient.emit(`${this.config.getKafka().prefix}-flat-occupied-event`, {
        id: uuid(),
        type: 'event',
        action: 'FlatOccupied',
        timestamp: Date.now(),
        data: {
          flatId: doc.flat,
          occupied: false
        },
      });

      this.kafkaClient.emit(`${this.config.getKafka().prefix}-device-pull-event`, {
        id: uuid(),
        type: 'event',
        action: 'PullStateChangeDevice',
        timestamp: Date.now(),
        data: {
          flatId: dto.flat,
          pull: true
        },
      });

      this.kafkaClient.emit(`${this.config.getKafka().prefix}-flat-occupied-event`, {
        id: uuid(),
        type: 'event',
        action: 'FlatOccupied',
        timestamp: Date.now(),
        data: {
          flatId: dto.flat,
          occupied: true
        },
      });
    }
    return doc;
  }

  async deleteOne(id: string): Promise<string> {
    this.logger.debug(`TenantService - Delete Occupant`);
    const doc = await this.model.findById(id).exec();
    const deletion = await this.model.deleteOne({ _id: new Types.ObjectId(id) }).exec();
    if (deletion.n < 1) {
      throw new NotFoundException();
    }

    // stop to subscribe to flats
    this.kafkaClient.emit(`${this.config.getKafka().prefix}-device-pull-event`, {
      id: uuid(),
      type: 'event',
      action: 'PullStateChangeDevice',
      timestamp: Date.now(),
      data: {
        flatId: doc.flat,
        pull: false
      },
    });

    this.kafkaClient.emit(`${this.config.getKafka().prefix}-flat-occupied-event`, {
      id: uuid(),
      type: 'event',
      action: 'FlatOccupied',
      timestamp: Date.now(),
      data: {
        flatId: doc.flat,
        occupied: false
      },
    });

    return id;
  }


  async computeBillingForUser(id: string, req: ExtendedRequest): Promise<BillingOccupant> {
    const occupant = await this.model.findById(id).exec();

    if (!occupant) {
      throw new NotFoundException();
    }
    this.logger.debug(`TenantService - Heating cost billing for flat ${occupant.flat} `);

    return new Promise<BillingOccupant>(async (resolve, reject) => {
      try {
        const headers = { Authorization: req.header('authorization') };
        let address;
        let roomsMeterValues;
        forkJoin([this.httpService
          .get(`http://building:3000/api/buildings/flats/${occupant.flat}/address`, { headers }).pipe(tap((res) => address = res.data.address)),
          this.httpService
            .get(`http://device:3000/api/devices/${occupant.flat}/meter`, { headers, params: { startTime: occupant.moveInDate.toISOString() } })
            .pipe(tap((res) => roomsMeterValues = res.data))
        ]).pipe(take(1)).subscribe((res) => {
          const billings = roomsMeterValues.map((rMeterValues: RoomMinMaxMeterValue) => {
            const billingValue = (rMeterValues.maxMeterValue - rMeterValues.minMeterValue)  * 6 / 100;
            return {
              ...rMeterValues,
              billingValue
            };
          });
          return resolve({ occupant, address, billings })
        });
      } catch (err) {
        this.logger.error(err);
        return reject(err);
      }
    });
  }
}
