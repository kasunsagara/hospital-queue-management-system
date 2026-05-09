import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
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
    return this.patientsService.create(createPatientDto, req.user.userId);
  }

  @Get()
  @Roles('hospital')
  findAll(@Req() req: any) {
    return this.patientsService.findAllByHospital(req.user.userId);
  }
}
