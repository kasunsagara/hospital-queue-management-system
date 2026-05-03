import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { QueueService } from './queue.service';
import { CreateQueueDto } from './dto/create-queue.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('queue')
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  @Post('token')
  @UseGuards(JwtAuthGuard)
  createToken(@Body() createQueueDto: CreateQueueDto) {
    return this.queueService.createToken(createQueueDto);
  }

  @Get('status')
  getQueueStatus(@Query('service') service?: string) {
    return this.queueService.getQueueStatus(service);
  }

  @Patch('call-next/:service')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('counter', 'admin')
  callNext(@Param('service') service: string) {
    return this.queueService.callNext(service);
  }

  @Patch('complete/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('counter', 'admin')
  completeToken(@Param('id') id: string) {
    return this.queueService.completeToken(id);
  }
}
