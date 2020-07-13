import { IsString, IsNotEmpty, Equals, IsNumber } from 'class-validator';

export class Command {
  @IsString()
  @IsNotEmpty()
  readonly id: string;

  @IsNotEmpty()
  @IsString()
  @Equals('command')
  readonly type: string;

  @IsNotEmpty()
  @IsString()
  readonly action: string;

  @IsNotEmpty()
  @IsNumber()
  readonly timestamp: string;
}
