import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type QueueDocument = HydratedDocument<Queue>;

@Schema({ timestamps: true })
export class Queue {
  @Prop({ required: true, unique: true })
  token: string;

  @Prop({ required: true })
  service: string;

  @Prop({
    enum: ['waiting', 'called', 'completed', 'cancelled'],
    default: 'waiting',
  })
  status: string;
}

export const QueueSchema = SchemaFactory.createForClass(Queue);
