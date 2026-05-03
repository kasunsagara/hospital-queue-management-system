import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QueueService } from './queue.service';
import { QueueController } from './queue.controller';
import { Queue, QueueSchema } from './queue.schema';
import { WebsocketModule } from '../websocket/websocket.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Queue.name, schema: QueueSchema }]),
    WebsocketModule,
  ],
  providers: [QueueService],
  controllers: [QueueController],
})
export class QueueModule {}
