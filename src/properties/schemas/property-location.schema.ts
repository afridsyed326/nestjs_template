import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class PropertyLocation {
  @Prop({ type: String, enum: ['Point', 'Polygon'], default: 'Point' })
  type: string;

  @Prop({
    type: [[Number]], // Changed to double array to support Polygon as well
    required: true,
  })
  coordinates: number[] | number[][];
}

// Create the schema factory for PropertyLocation
export const PropertyLocationSchema =
  SchemaFactory.createForClass(PropertyLocation);
