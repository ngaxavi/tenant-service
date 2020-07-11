import { Command } from './command';
import { IsNotEmpty, ValidateNested, IsString } from 'class-validator';
import { Type } from 'class-transformer';

class Tenant {
  @IsNotEmpty()
  @IsString()
  readonly name: string;
}

export class CreateTenantCommand extends Command {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Tenant)
  readonly data: Tenant;
}
