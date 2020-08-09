import { Document } from 'mongoose';
import { Prop as Property, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  collation: { locale: 'en_US', strength: 1, caseLevel: true },
  timestamps: true
})
export class Tenant extends Document {
  @Property()
  name: string;

  @Property([String])
  occupants: string[];

  @Property([String])
  buildings: string[];
}

export const TenantSchema = SchemaFactory.createForClass(Tenant);

@Schema({
  collation: { locale: 'en_US', strength: 1, caseLevel: true },
  timestamps: true
})
export class Occupant extends Document {

  @Property({ required: true })
  name: string;

  @Property({ required: true })
  moveInDate: Date;

  @Property()
  moveOutDate: Date;

  @Property({ required: true })
  tenant: string;

  @Property({required: true})
  building: string;

  @Property({ required: true })
  flat: string;

 }
