import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class RequestGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('RequestGateway');

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway Initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // Emit event when a new request is created
  sendRequestCreated(request: any) {
    this.server.emit('requestCreated', request);
  }

  // Emit event when a request is matched
  sendRequestMatched(request: any) {
    this.server.emit('requestMatched', request);
  }

  // Emit event when a request is completed
  sendRequestCompleted(request: any) {
    this.server.emit('requestCompleted', request);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, payload: string): void {
    client.join(payload);
    this.logger.log(`Client ${client.id} joined room ${payload}`);
  }
}

