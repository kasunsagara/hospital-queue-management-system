import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../users/user.schema';

export type BloodRequestDocument = HydratedDocument<BloodRequest>;

@Schema({ timestamps: true })
export class BloodRequest {
  @Prop({ required: true })
  bloodGroup: string;

  @Prop({ required: true })
  units: number;

  @Prop({ required: true })
  location: string;

  @Prop({ enum: ['high', 'normal'], default: 'normal' })
  urgency: string;

  @Prop({
    enum: ['pending', 'matched', 'in_progress', 'completed'],
    default: 'pending',
  })
  status: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  donorId?: Types.ObjectId | User;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  hospitalId: Types.ObjectId | User;
}

export const BloodRequestSchema = SchemaFactory.createForClass(BloodRequest);
