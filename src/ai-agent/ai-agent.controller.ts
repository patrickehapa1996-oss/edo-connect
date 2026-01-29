// src/ai-agent/ai-agent.controller.ts

import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AiAgentService } from './ai-agent.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface ChatRequestDto {
  message: string;
  conversationHistory?: any[];
}

interface ChatResponseDto {
  message: string;
  toolsUsed?: string[];
  conversationHistory: any[];
  error?: string;
}

@Controller('ai-agent')
@UseGuards(JwtAuthGuard)
export class AiAgentController {
  constructor(private readonly aiAgentService: AiAgentService) {}

  @Post('chat')
  @HttpCode(HttpStatus.OK)
  async chat(
    @Request() req: { user: { id: string } },
    @Body() body: ChatRequestDto,
  ): Promise<ChatResponseDto> {
    const userId = req.user.id;

    return await this.aiAgentService.chat(
      userId,
      body.message,
      body.conversationHistory || [],
    );
  }
}
