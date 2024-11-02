import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../constant/auth.constants';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../roles/decorator/role.decorator';
import { Role } from '../roles/enum/role.enum';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      request['user'] = payload;

      console.log('🚀~ JWT Payload:', payload);
      console.log('🚀~ User Role:', payload.role);

      // If roles are required, check if the user's role is among them
      if (requiredRoles && !requiredRoles.includes(payload.role)) {
        console.log('Required Roles:', requiredRoles);
        throw new ForbiddenException('You do not have access to this resource');
      }
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
