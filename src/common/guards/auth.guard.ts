import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { ROLES_KEY } from "../decorator/roles.decorator";
import jwt from "jsonwebtoken";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    ctx: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (roles?.includes("public")) return true;
    
    const req = ctx.switchToHttp().getRequest();
    const auth = req.headers.authorization as string | undefined;
    
    if (!auth?.startsWith("Bearer")) throw new UnauthorizedException();
    
    const token = auth.slice(7);
    
    try {
      const payload = jwt.verify(token, process.env.ACCESS_TOKEN_KEY!);
      req.user = payload;
      
      return true;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

}
