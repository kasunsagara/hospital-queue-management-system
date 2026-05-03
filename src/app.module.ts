import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { QueueModule } from './queue/queue.module';
import { ServicesModule } from './services/services.module';
import { CountersModule } from './counters/counters.module';
import { WebsocketModule } from './websocket/websocket.module';

@Module({
  imports: [AuthModule, UsersModule, QueueModule, ServicesModule, CountersModule, WebsocketModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
