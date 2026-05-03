import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Queue } from './queue.schema';
import { CreateQueueDto } from './dto/create-queue.dto';
import { QueueGateway } from '../websocket/queue.gateway';

@Injectable()
export class QueueService {
  constructor(
    @InjectModel(Queue.name) private queueModel: Model<Queue>,
    private queueGateway: QueueGateway,
  ) {}

  async createToken(createQueueDto: CreateQueueDto) {
    const { service } = createQueueDto;

    // Find the last token for this service created today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const last = await this.queueModel
      .findOne({
        service,
        createdAt: { $gte: startOfDay },
      })
      .sort({ createdAt: -1 })
      .exec();

    let nextNumber = 1;

    if (last && last.token) {
      const parts = last.token.split('-');
      const lastNum = parseInt(parts[parts.length - 1]);
      if (!isNaN(lastNum)) {
        nextNumber = lastNum + 1;
      }
    }

    // Format: SERVICE-NUM (e.g., OP-001)
    const token = `${service.toUpperCase()}-${String(nextNumber).padStart(3, '0')}`;

    const newToken = new this.queueModel({
      token,
      service,
      status: 'waiting',
    });

    const saved = await newToken.save();
    this.queueGateway.sendTokenCreated(saved);
    return saved;
  }

  async getQueueStatus(service?: string) {
    const query = service ? { service } : {};
    return this.queueModel.find(query).sort({ createdAt: 1 }).exec();
  }

  async callNext(service: string) {
    const nextInQueue = await this.queueModel
      .findOneAndUpdate(
        { service, status: 'waiting' },
        { status: 'called' },
        { sort: { createdAt: 1 }, new: true },
      )
      .exec();

    if (!nextInQueue) {
      throw new NotFoundException(
        `No patients waiting for service: ${service}`,
      );
    }

    this.queueGateway.sendTokenCalled(nextInQueue);
    return nextInQueue;
  }

  async completeToken(tokenId: string) {
    const updated = await this.queueModel
      .findByIdAndUpdate(tokenId, { status: 'completed' }, { new: true })
      .exec();

    if (!updated) {
      throw new NotFoundException(`Token with ID ${tokenId} not found`);
    }

    this.queueGateway.sendTokenCompleted(updated);
    return updated;
  }
}
