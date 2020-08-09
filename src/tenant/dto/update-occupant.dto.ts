import { IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateOccupantDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsDateString()
  @IsOptional()
  moveInDate: Date;

  @IsDateString()
  @IsOptional()
  moveOutDate: Date;

  @IsString()
  @IsOptional()
  tenant: string;

  @IsString()
  @IsOptional()
  building: string;

  @IsString()
  @IsOptional()
  flat: string;
}
