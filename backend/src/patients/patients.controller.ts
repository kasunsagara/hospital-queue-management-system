import { Controller, Get, Post, Body, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('patients')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  @Roles('hospital')
  create(@Body() createPatientDto: any, @Req() req: any) {
    if (req.user.role === 'hospital' && !req.user.isVerified) {
      throw new ForbiddenException('Your hospital account is not verified yet.');
    }
    return this.patientsService.create(createPatientDto, req.user.userId);
  }

  @Get()
  @Roles('hospital')
  findAll(@Req() req: any) {
    return this.patientsService.findAllByHospital(req.user.userId);
  }
}
