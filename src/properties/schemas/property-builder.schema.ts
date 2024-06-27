import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class PropertyBuilders extends Document {
  @Prop({
    required: true,
    type: String,
  })
  name: string;
  @Prop({ required: true, type: String, unique: true })
  key: string;
}

export const PropertyBuildersSchema =
  SchemaFactory.createForClass(PropertyBuilders);

export const PROPERTY_BUILDERS_CNAME = 'propertybuilders';
