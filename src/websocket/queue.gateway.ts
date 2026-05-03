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
export class QueueGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('QueueGateway');

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway Initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // Emit event when a new token is created
  sendTokenCreated(token: any) {
    this.server.emit('tokenCreated', token);
  }

  // Emit event when a patient is called
  sendTokenCalled(token: any) {
    this.server.emit('tokenCalled', token);
  }

  // Emit event when a token is completed
  sendTokenCompleted(token: any) {
    this.server.emit('tokenCompleted', token);
  }

  @SubscribeMessage('joinQueue')
  handleJoinQueue(client: Socket, payload: string): void {
    client.join(payload);
    this.logger.log(`Client ${client.id} joined room ${payload}`);
  }
}
