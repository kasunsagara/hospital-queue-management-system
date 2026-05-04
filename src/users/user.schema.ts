import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ enum: ['donor', 'hospital', 'admin'], default: 'donor' })
  role: string;

  @Prop({ required: false })
  bloodGroup: string;

  @Prop({
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  })
  location: {
    type: string;
    coordinates: number[];
  };

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ required: true })
  contactNumber: string;

  @Prop({ default: true })
  availability: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ location: '2dsphere' });
