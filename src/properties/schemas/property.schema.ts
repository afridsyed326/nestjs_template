import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { PropertyBuilders } from './property-builder.schema';
import { PropertyAddressParts } from './address-part.schema';

export enum PROPERTY_STATUS {
  UNDER_CONSTRUCTION = 'off-plan',
  READY = 'ready',
}

export enum RESIDENTIAL_PROPERTY_TYPES {
  APARTMENT = 'apartment',
  TOWNHOUSE = 'townhouse',
  VILLA = 'villa',
  VILLA_COMPOUND = 'villa-compound',
  RESIDENTIAL_PLOT = 'residential-plot',
  RESIDENTIAL_BUILDING = 'residential-building',
  PENTHOUSE = 'penthouse',
  HOTELAPARTMENT = 'hotel-apartment',
  RESIDENTIAL_FLOOR = 'residential-floor',
}

export enum COMMERCIAL_PROPERTY_TYPES {
  OFFICE = 'office',
  SHOP = 'shop',
  WAREHOUSE = 'warehouse',
  LABOUR_CAMP = 'labour-camp',
  COMMERCIAL_VILLA = 'commercial-villa',
  BULK_UNIT = 'bulk-unit',
  COMMERCIAL_PLOT = 'commercial-plot',
  COMMERCIAL_FLOOR = 'commercial-floor',
  COMMERCIAL_BUILDING = 'commercial-building',
  FACTORY = 'factory',
  INDUSTRIAL_LAND = 'industrial-land',
  MIXED_USE_LAND = 'mixed-use-land',
  SHOWROOM = 'showroom',
  OTHER_COMMERCIAL = 'other-commercial',
}

export const PROPERTY_TYPES = {
  ...RESIDENTIAL_PROPERTY_TYPES,
  ...COMMERCIAL_PROPERTY_TYPES,
};

@Schema({ timestamps: true })
export class Property extends Document {
  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: true, type: String })
  referanceNumber: string;

  @Prop({ required: true, type: String })
  permitNumber: string;

  @Prop({ required: true, type: String })
  description: string;

  @Prop({ required: true, type: String, enum: Object.values(PROPERTY_TYPES) })
  type: string;

  // @Prop({
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'PropertyLocation',
  //   required: true,
  // })
  // location: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: PropertyBuilders.name,
    required: true,
  })
  builder: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: PropertyAddressParts.name,
    required: true,
  })
  address: mongoose.Types.ObjectId;

  @Prop()
  isForRent: string;
  @Prop()
  isForSale: string;

  @Prop({ required: true, type: String, enum: Object.values(PROPERTY_STATUS) })
  status: string;

  @Prop()
  sizeInSqFeet: number;

  @Prop()
  pricePerSqFt: number;

  @Prop()
  bedrooms: number;

  @Prop()
  bathrooms: number;

  @Prop()
  parkings: number;

  @Prop()
  minPrice: number;

  @Prop()
  maxPrice: number;

  @Prop()
  postedDate: Date;

  @Prop()
  deliveryDate: Date;

  @Prop()
  amenities: Array<string>;

  @Prop()
  floorPlanLink: string;

  @Prop()
  brochureLink: string;
}

export const PropertySchema = SchemaFactory.createForClass(Property);
