// src/ai-agent/dto/chat.dto.ts

import { IsString, IsArray, IsOptional, MinLength } from 'class-validator';

export class ChatRequestDto {
  @IsString()
  @MinLength(1, { message: 'Message cannot be empty' })
  message: string;

  @IsArray()
  @IsOptional()
  conversationHistory?: ConversationMessage[];
}

export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string | ContentBlock[] | ToolResult[];
}

export interface ContentBlock {
  type: 'text' | 'tool_use';
  text?: string;
  id?: string;
  name?: string;
  input?: Record<string, unknown>;
}

export interface ToolResult {
  type: 'tool_result';
  tool_use_id: string;
  content: string;
  is_error?: boolean;
}

export interface ChatResponseDto {
  message: string;
  toolsUsed?: string[];
  conversationHistory: ConversationMessage[];
  error?: string;
}
