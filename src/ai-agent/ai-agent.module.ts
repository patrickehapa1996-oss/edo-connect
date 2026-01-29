// src/ai-agent/ai-agent.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiAgentService } from './ai-agent.service';
import { AiAgentController } from './ai-agent.controller';
import { PropertiesModule } from '../properties/properties.module';
import { BookingsModule } from '../bookings/bookings.module';
import { InquiriesModule } from '../inquiries/inquiries.module';
import { SupportModule } from '../support/support.module';
import { ViewingsModule } from '../viewings/viewings.module';

@Module({
  imports: [
    ConfigModule,
    PropertiesModule,
    BookingsModule,
    InquiriesModule,
    SupportModule,
    ViewingsModule,
  ],
  controllers: [AiAgentController],
  providers: [AiAgentService],
  exports: [AiAgentService],
})
export class AiAgentModule {}
