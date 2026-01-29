// src/viewings/viewings.module.ts

import { Module } from '@nestjs/common';
import { ViewingsService } from './viewings.service';

@Module({
  providers: [ViewingsService],
  exports: [ViewingsService],
})
export class ViewingsModule {}
