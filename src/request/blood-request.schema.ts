import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../users/user.schema';
import { Patient } from '../patients/patient.schema';

export type BloodRequestDocument = HydratedDocument<BloodRequest>;

@Schema({ timestamps: true })
export class BloodRequest {
  @Prop({ required: true })
  bloodGroup: string;

  @Prop({ required: true })
  units: number;

  @Prop({
    type: {
      type: String,
      enum: ['Point'],
      required: false,
    },
    coordinates: {
      type: [Number],
      required: false,
    },
  })
  location?: {
    type: string;
    coordinates: number[];
  };

  @Prop({ enum: ['high', 'normal'], default: 'normal' })
  urgency: string;

  @Prop({
    enum: ['pending', 'matched', 'in_progress', 'completed'],
    default: 'pending',
  })
  status: string;

  @Prop({ type: Types.ObjectId, ref: 'Patient', required: true })
  patientId: Types.ObjectId | Patient;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  donorId?: Types.ObjectId | User;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  hospitalId: Types.ObjectId | User;
}

export const BloodRequestSchema = SchemaFactory.createForClass(BloodRequest);
BloodRequestSchema.index({ location: '2dsphere' }, { sparse: true });
