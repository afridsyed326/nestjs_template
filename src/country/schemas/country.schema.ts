import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { IsNotEmpty } from 'class-validator';

export type CountryDocument = HydratedDocument<Country>;

@Schema({ timestamps: true })
export class Country {
  @Prop({
    required: true,
    type: String,
    unique: true,
    addListener: (value) => {
      console.log({value});
    },
  })
  @IsNotEmpty()
  name: string;

  @Prop({ required: true, type: String })
  @IsNotEmpty()
  code: string;

  @Prop()
  code3: string;

  @Prop()
  region: string;

  @Prop()
  subRegion: string;

  @Prop()
  regionCode: string;

  @Prop({ required: true })
  @IsNotEmpty()
  phoneCode: string;

  @Prop({ type: Date, default: null })
  deletedAt: Date;

}

export const CountrySchema = SchemaFactory.createForClass(Country);
