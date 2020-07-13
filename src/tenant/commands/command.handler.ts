import { RpcException } from '@nestjs/microservices';
import { TenantService } from '../tenant.service';
import { Command } from './command';
import { CreateTenantCommand } from './create-tenant.command';
import { Tenant } from '../tenant.schema';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CommandHandler {
  constructor(private tenantService: TenantService) {}

  async handler(command: Command): Promise<Tenant> {
    switch (command.action) {
      case 'CreateBuilding':
        return this.handleCreateTenantCommand(command as CreateTenantCommand);

      default:
        throw new RpcException(`Unsupported command action: ${command.action}`);
    }
  }

  private async handleCreateTenantCommand(command: CreateTenantCommand): Promise<Tenant> {
    return this.tenantService.createOne(command.data);
  }
}
