// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../user/user.service';
import { UserDocument } from '../user/schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(username: string, password: string): Promise<any> {
    const user: UserDocument | null = await this.usersService.findByUsername(username);

    if (!user) {
      throw new UnauthorizedException('Invalid username');
    }

    if (!await bcrypt.compare(password, user.password)) {
      throw new UnauthorizedException('Invalid password');
    }

    const payload = { username: user.username, role: user.role, sub: user._id };
    const token = this.jwtService.sign(payload);

    return {
      message: 'Login successful',
      role: user.role,
      redirectTo: this.getRedirectPath(user.role),
      user,
      token,
    };
  }

  private getRedirectPath(role: string) {
    switch (role) {
      case 'admin':
        return '/admin/dashboard';
      case 'superAdmin':
        return '/super-admin/panel';
      default:
        return '/student/home';
    }
  }
}
