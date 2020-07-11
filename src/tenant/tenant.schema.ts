import { Document } from 'mongoose';
import { Prop as Property, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  collation: { locale: 'en_US', strength: 1, caseLevel: true },
  timestamps: true
})
export class Tenant extends Document {
  @Property()
  name: string;
}

export const TenantSchema = SchemaFactory.createForClass(Tenant);
