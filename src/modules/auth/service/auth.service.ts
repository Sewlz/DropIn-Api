import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../user/service/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/modules/user/schema/user.schema';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.getUserByUserName(username);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    throw new UnauthorizedException('Invalid credentials');
  }
  async login(user: any) {
    const payload = {
      username: user._doc.username,
      sub: user._doc._id,
      role: user._doc.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
