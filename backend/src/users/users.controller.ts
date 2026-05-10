import { Controller, Get, Patch, Param, Body, UseGuards, Req, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  getProfile(@Req() req) {
    return this.usersService.findById(req.user.userId);
  }

  @Patch('availability')
  @Roles('donor')
  updateAvailability(@Req() req, @Body('availability') availability: boolean) {
    return this.usersService.updateAvailability(req.user.userId, availability);
  }

  @Patch('verify/:id')
  @Roles('admin')
  verifyHospital(@Param('id') id: string) {
    return this.usersService.verifyHospital(id);
  }

  @Get('all')
  @Roles('admin')
  findAll() {
    return this.usersService.findAllUsers();
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
