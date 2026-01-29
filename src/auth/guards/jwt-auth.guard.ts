// src/auth/guards/jwt-auth.guard.ts

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // TODO: Implement JWT validation
    // This is a placeholder - implement actual JWT verification
    const request = context.switchToHttp().getRequest();

    // For now, check if Authorization header exists
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return false;
    }

    // TODO: Verify JWT token and extract user
    // request.user = decodedToken;

    return true;
  }
}
