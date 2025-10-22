import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { User } from './schemas/user.schema';
import { UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  // Create user by superAdmin (protected with JWT and role check)
  @Post('create-by-superadmin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async createBySuperAdmin(@Body() newUserData: Partial<User>) {
    // Ensure new user is admin, student, or superAdmin
    if (!['admin', 'students', 'superAdmin'].includes(newUserData.role || 'students')) {
      throw new UnauthorizedException('SuperAdmin can only create admin, students, or superAdmin');
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
  async update(@Param('id') id: string, @Body() updateData: Partial<User>) {
    return this.userService.update(id, updateData);
  }

  // Delete user
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
