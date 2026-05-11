import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { RequestService } from './request.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('request')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Post('create')
  @Roles('hospital')
  create(@Body() createRequestDto: CreateRequestDto, @Request() req) {
    if (req.user.role === 'hospital' && !req.user.isVerified) {
      throw new ForbiddenException('Your hospital account is not verified yet.');
    }
    return this.requestService.create(createRequestDto, req.user.userId);
  }

  @Get('all')
  findAll() {
    return this.requestService.findAll();
  }

  @Get('my')
  findMy(@Request() req) {
    return this.requestService.findByUserId(req.user.userId, req.user.role);
  }

  @Patch('accept/:id')
  @Roles('donor')
  accept(@Param('id') id: string, @Request() req) {
    return this.requestService.acceptRequest(id, req.user.userId);
  }

  @Patch('status/:id')
  @Roles('hospital')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Request() req,
  ) {
    return this.requestService.updateStatus(id, status, req.user.userId);
  }

  @Get('matches/:id')
  @Roles('hospital', 'admin')
  findMatches(@Param('id') id: string) {
    return this.requestService.findMatchingDonors(id);
  }
}
