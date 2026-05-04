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

  @Prop({ required: true })
  location: string;

  @Prop({ default: true })
  availability: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
