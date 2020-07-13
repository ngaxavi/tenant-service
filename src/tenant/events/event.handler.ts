import { Event } from './event';
import { RpcException } from '@nestjs/microservices';
import { TenantService } from '../tenant.service';
import { Injectable } from '@nestjs/common';
import { Tenant } from '../tenant.schema';
import { BuildingModifiedEvent } from './building-modified.event';

@Injectable()
export class EventHandler {
  constructor(private tenantService: TenantService) {}

  async handleEvent(event: Event): Promise<Tenant> {
    switch (event.action) {
      case 'BuildingModified':
        return this.handleBuildingModified(event as BuildingModifiedEvent);

      default:
        throw new RpcException(`Unsupported event action: ${event.action}`);
    }
  }

  private async handleBuildingModified(event: BuildingModifiedEvent): Promise<Tenant> {
    return this.tenantService.buildingModified(event);
  }
}
