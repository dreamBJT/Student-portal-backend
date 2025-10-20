import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.schema';
import { Request } from 'express';

// Define a type-safe request interface
interface AuthenticatedRequest extends Request {
  user?: {
    role: 'students' | 'admin' | 'superAdmin';
    [key: string]: any; // other user info like id, email
  };
}

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() userData: Partial<User>, @Req() req: AuthenticatedRequest) {
    const currentUserRole = req.user?.role ?? 'students';
    return this.userService.create(userData, currentUserRole);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateData: Partial<User>,
    @Req() req: AuthenticatedRequest,
  ) {
    const currentUserRole = req.user?.role ?? 'students';
    return this.userService.update(id, updateData, currentUserRole);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
