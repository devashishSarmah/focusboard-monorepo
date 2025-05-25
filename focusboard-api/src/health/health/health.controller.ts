import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  TypeOrmHealthIndicator,
  HealthCheckResult,
  MicroserviceHealthIndicator,
} from '@nestjs/terminus';

import { Transport } from '@nestjs/microservices';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private micro: MicroserviceHealthIndicator,
  ) {}

  // Liveness: just ensure the app is running
  @Get('live')
  @HealthCheck()
  live(): Promise<HealthCheckResult> {
    return this.health.check([]);
  }

  // Readiness: check database and Redis HTTP endpoint
  @Get('ready')
  @HealthCheck()
  ready(): Promise<HealthCheckResult> {
    return this.health.check([
      async () => this.db.pingCheck('database', { timeout: 1000 }),
      async () =>
        this.micro.pingCheck('redis', {
          transport: Transport.TCP,
          options: {
            host: process.env.REDIS_HOST || 'redis',
            port: Number(process.env.REDIS_PORT) || 6379,
          },
        }),
    ]);
  }
}
