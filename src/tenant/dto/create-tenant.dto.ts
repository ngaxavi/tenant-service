import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTenantDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString({ each: true })
  @IsOptional()
  buildings: string[];

  @IsString({ each: true })
  @IsOptional()
  occupants: string[];
}
