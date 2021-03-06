import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';


export class CreateOccupantDto {

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsDateString()
  @IsNotEmpty()
  moveInDate: Date;

  @IsDateString()
  @IsOptional()
  moveOutDate: Date;

  @IsString()
  @IsNotEmpty()
  flat: string;
}
