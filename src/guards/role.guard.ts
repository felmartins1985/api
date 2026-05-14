import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  async canActivate(context: ExecutionContext) {
    // Busca os roles definidos via @Roles() no método ou na classe (método tem prioridade).
    // getAllAndOverride percorre os targets em ordem e retorna o primeiro valor não-undefined.
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    console.log('user', user);
    const rolesFilted = requiredRoles.filter((role) => role === user.role);
    return rolesFilted.length > 0;
  }
}
