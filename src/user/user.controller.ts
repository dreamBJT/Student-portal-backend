import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './user.service';
import { User } from './schemas/user.schema';
import { UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { storage } from '../cloudinary/cloudinary.provider';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  // Create user by superAdmin (protected with JWT and role check)
  @Post('create-by-superadmin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('image', { storage }))
  async createBySuperAdmin(
    @Body() newUserData: Partial<User>,
    @UploadedFile() file?: any,
  ) {
    // Ensure new user is admin, student, or superAdmin
    if (!['admin', 'students', 'superAdmin'].includes(newUserData.role || 'students')) {
      throw new UnauthorizedException('SuperAdmin can only create admin, students, or superAdmin');
    }
    if (file) {
      (newUserData as any).image = (file as any).path;
    }

    return this.userService.createUser(newUserData);
  }

  // Get all users
  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  // Get user by ID
  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  // Update user info
  @Put(':id')
  @UseInterceptors(FileInterceptor('image', { storage }))
  async update(
    @Param('id') id: string,
    @Body() updateData: Partial<User>,
    @UploadedFile() file?: any,
  ) {
    if (file) {
      (updateData as any).image = (file as any).path;
    }
    return this.userService.update(id, updateData);
  }

  // Delete user
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
