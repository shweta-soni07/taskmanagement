import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor<T>
  implements
    NestInterceptor<T, { success: boolean; timestamp: string; data: T }>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<{ success: boolean; timestamp: string; data: T }> {
    return next.handle().pipe(
      map((data: T) => ({
        success: true,
        timestamp: new Date().toISOString(),
        data,
      })),
    );
  }
}
