import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
export class LogInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const dt = Date.now();
    return next.handle().pipe(
      tap(() => {
        console.log(`URL: ${context.switchToHttp().getRequest().url}`);
        console.log(`Method: ${context.switchToHttp().getRequest().method}`);
        console.log(`Execution time: ${Date.now() - dt}ms`);
      }),
    );
  }
}
