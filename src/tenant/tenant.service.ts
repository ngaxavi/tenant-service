import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tenant } from './tenant.schema';
import { LoggerService } from '@tenant/logger';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { BuildingModifiedEvent } from './events/building-modified.event';

@Injectable()
export class TenantService {
  constructor(@InjectModel('Tenant') private readonly model: Model<Tenant>, private readonly logger: LoggerService) {}

  async findAll(): Promise<Tenant[]> {
    return this.model.find().exec();
  }

  async findOne(id: string): Promise<Tenant> {
    return this.model.findById(id);
  }

  async createOne(dto: CreateTenantDto): Promise<Tenant> {
    return this.model.create(dto);
  }

  async buildingModified(event: BuildingModifiedEvent): Promise<Tenant> {
    this.logger.log(`${event}`);
    return this.model.find().exec()[0];
  }
}
