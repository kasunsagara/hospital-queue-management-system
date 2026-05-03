import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { QueueService } from './queue.service';
import { CreateQueueDto } from './dto/create-queue.dto';

@Controller('queue')
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  @Post('token')
  createToken(@Body() createQueueDto: CreateQueueDto) {
    return this.queueService.createToken(createQueueDto);
  }

  @Get('status')
  getQueueStatus(@Query('service') service?: string) {
    return this.queueService.getQueueStatus(service);
  }

  @Patch('call-next/:service')
  callNext(@Param('service') service: string) {
    return this.queueService.callNext(service);
  }

  @Patch('complete/:id')
  completeToken(@Param('id') id: string) {
    return this.queueService.completeToken(id);
  }
}
