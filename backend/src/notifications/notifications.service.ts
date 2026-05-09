import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification, NotificationDocument } from './notification.schema';
import { RequestGateway } from '../websocket/request.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
    private readonly requestGateway: RequestGateway,
  ) {}

  async sendNotification(userId: string, message: string, type: string, requestId?: string) {
    const notification = new this.notificationModel({
      userId: new Types.ObjectId(userId),
      message,
      type,
      requestId: requestId ? new Types.ObjectId(requestId) : undefined,
    });
    await notification.save();

    // Emit WebSocket event
    this.requestGateway.server.to(userId).emit('notification', {
      message,
      type,
      requestId,
      createdAt: notification.createdAt,
    });
  }

  async getMyNotifications(userId: string) {
    return this.notificationModel.find({ userId: new Types.ObjectId(userId) }).sort({ createdAt: -1 }).limit(20).exec();
  }

  async markAsRead(notificationId: string) {
    return this.notificationModel.findByIdAndUpdate(notificationId, { isRead: true }).exec();
  }
}
