import { Event } from './event';
import { IsOptional } from 'class-validator';

export class BuildingModifiedEvent extends Event {
  @IsOptional()
  data: any;
}
