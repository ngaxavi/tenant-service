import { IsOptional, IsString } from 'class-validator';

export class UpdateTenantDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString({ each: true })
  @IsOptional()
  buildings: string[];

  @IsString({ each: true })
  @IsOptional()
  occupants: string[];
}
