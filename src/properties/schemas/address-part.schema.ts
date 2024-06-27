import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({ timestamps: true })
export class PropertyAddressParts extends Document {
  @Prop({
    required: true,
    type: String,
  })
  name: string;

  @Prop({ required: true, type: String, unique: true })
  key: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'PropertyAddressParts' })
  parent: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'PropertyAddressParts' },
    ],
    default: [],
  })
  children: Array<mongoose.Schema.Types.ObjectId>;
}

export const PropertyAddressPartsSchema =
  SchemaFactory.createForClass(PropertyAddressParts);

export const PROPERTY_ADDRESS_PARTS_CNAME = 'propertyaddressparts';
