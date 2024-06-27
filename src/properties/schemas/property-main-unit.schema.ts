import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class PropertyMainUnit extends Document {
  @Prop({
    required: true,
    type: String,
  })
  name: string;
  @Prop({ required: true, type: String, unique: true })
  key: string;
}

export const PropertyMainUnitSchema =
  SchemaFactory.createForClass(PropertyMainUnit);
