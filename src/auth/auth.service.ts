import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UsersRepository } from 'src/users/users.repository';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import bcrypt from 'bcrypt';
import { access } from 'fs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepo: UsersRepository,
    private readonly jwt: JwtService,
  ) {}
  async create(dto: CreateUserDto) {
    return this.userRepo.create(dto);
  }

  async login(email: string, password: string) {
    const user = await this.userRepo.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      access_token: this.jwt.sign(payload, { expiresIn: '1d' }),
    };
  }
}
