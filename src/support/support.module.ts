// src/support/support.module.ts

import { Module } from '@nestjs/common';
import { SupportService } from './support.service';

@Module({
  providers: [SupportService],
  exports: [SupportService],
})
export class SupportModule {}
