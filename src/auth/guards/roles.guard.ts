import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const required = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    if (!required) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    return required.includes(user.role);
  }
}
