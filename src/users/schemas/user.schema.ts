import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export enum USER_TYPES {
  USER = 'user',
  ADMIN = 'admin',
}

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({
    required: true,
    type: String,
    unique: true,
  })
  email: string;
  @Prop({
    default: USER_TYPES.USER,
    enum: USER_TYPES,
  })
  type: string;

  @Prop()
  firstName: string;
  @Prop()
  lastName: string;
  @Prop()
  password: string;
  @Prop({
    default: false,
  })
  emailVerified: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Country' })
  country: mongoose.Types.ObjectId;

  @Prop()
  phone: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
