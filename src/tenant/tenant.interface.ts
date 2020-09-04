import { Occupant } from './tenant.schema';

export interface RoomMinMaxMeterValue {
  roomNr: number;
  minMeterValue: number;
  maxMeterValue: number;
  billingValue?: number;
}


export interface BillingOccupant {
  occupant: Occupant,
  address: string;
  billings: RoomMinMaxMeterValue[];
}
