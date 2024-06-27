import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminLoginDto } from './dto/admin.dto';
import { AdminJwtAuthGuard } from './auth/admin.auth.guard';

@UseGuards(AdminJwtAuthGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @UseGuards()
  @Post('auth/login')
  async adminLogin(@Body() adminLoginDto: AdminLoginDto) {
    return await this.adminService.adminLogin(
      adminLoginDto.email,
      adminLoginDto.password,
    );
  }

  @Get('users')
  async getUsersList(
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    return await this.adminService.getUsersList(page, limit);
  }
}
