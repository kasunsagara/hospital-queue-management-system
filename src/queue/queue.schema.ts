import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Queue {

  @Prop()
  token: string;

  @Prop()
  service: string;

  @Prop({ default: 'waiting' })
  status: string;
}

export const QueueSchema = SchemaFactory.createForClass(Queue);