import { Module } from '@nestjs/common';
import { RequestGateway } from './request.gateway';

@Module({
  providers: [RequestGateway],
  exports: [RequestGateway],
})
export class WebsocketModule {}

