import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tenant } from './tenant.schema';
import { LoggerService } from '@tenant/logger';

@Injectable()
export class TenantService {
  constructor(@InjectModel('Tenant') private readonly model: Model<Tenant>, private readonly logger: LoggerService) {}

  async findAll(): Promise<Tenant[]> {
    return this.model.find().exec();
  }
}
