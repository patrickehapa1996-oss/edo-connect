import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthService } from './health.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Check API health status' })
  @ApiResponse({ status: 200, description: 'API is healthy' })
  check() {
    return this.healthService.check();
  }

  @Get('ready')
  @ApiOperation({ summary: 'Check if API is ready to accept requests' })
  @ApiResponse({ status: 200, description: 'API is ready' })
  ready() {
    return this.healthService.readinessCheck();
  }
}
