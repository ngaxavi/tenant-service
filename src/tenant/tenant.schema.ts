import { Document } from 'mongoose';
import { Prop as Property, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Tenant extends Document {
  @Property()
  name: string;
}

export const TenantSchema = SchemaFactory.createForClass(Tenant);
