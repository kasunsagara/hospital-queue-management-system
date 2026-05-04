import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type NotificationDocument = HydratedDocument<Notification>;

@Schema({ timestamps: true })
export class Notification {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  message: string;

  @Prop({ enum: ['new_request', 'request_accepted', 'request_completed'], required: true })
  type: string;

  @Prop({ default: false })
  isRead: boolean;

  @Prop({ type: Types.ObjectId, ref: 'BloodRequest' })
  requestId?: Types.ObjectId;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
