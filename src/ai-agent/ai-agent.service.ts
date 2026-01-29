// src/ai-agent/ai-agent.service.ts

import {
  Injectable,
  Logger,
  HttpException,
  HttpStatus,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';
import { ConfigService } from '@nestjs/config';
import { PropertiesService } from '../properties/properties.service';
import { BookingsService } from '../bookings/bookings.service';
import { InquiriesService } from '../inquiries/inquiries.service';
import { SupportService } from '../support/support.service';
import { ViewingsService } from '../viewings/viewings.service';

// Type definitions
interface ToolUseBlock {
  type: 'tool_use';
  id: string;
  name: string;
  input: Record<string, unknown>;
}

interface TextBlock {
  type: 'text';
  text: string;
}

type ContentBlock = ToolUseBlock | TextBlock;

interface ToolResult {
  type: 'tool_result';
  tool_use_id: string;
  content: string;
  is_error?: boolean;
}

interface Message {
  role: 'user' | 'assistant';
  content: string | ContentBlock[] | ToolResult[];
}

interface ChatResponse {
  message: string;
  toolsUsed?: string[];
  conversationHistory: Message[];
  error?: string;
}

interface SearchPropertiesInput {
  location: string;
  property_type?: 'land' | 'house' | 'apartment' | 'duplex' | 'bungalow' | 'commercial' | 'hotel_room' | 'all';
  purpose?: 'sale' | 'rent' | 'shortlet' | 'all';
  price_min?: number;
  price_max?: number;
  bedrooms_min?: number;
  bathrooms_min?: number;
  amenities?: string[];
  verified_only?: boolean;
  featured_only?: boolean;
  limit?: number;
}

interface SearchHotelsInput {
  location: string;
  check_in: string;
  check_out: string;
  guests?: number;
  price_max?: number;
}

interface AvailabilityInput {
  property_id: string;
  check_in: string;
  check_out: string;
}

interface BookingPriceInput {
  property_id: string;
  check_in: string;
  check_out: string;
  guests?: number;
}

interface ScheduleViewingInput {
  property_id: string;
  preferred_date: string;
  preferred_time?: string;
  notes?: string;
}

interface EscalateInput {
  issue_type: 'payment' | 'booking' | 'technical' | 'complaint' | 'fraud' | 'other';
  context: string;
  urgency?: 'low' | 'medium' | 'high' | 'critical';
}

interface NeighborhoodInfo {
  name: string;
  description: string;
  average_price_sale: { min: number; max: number };
  average_price_rent: { min: number; max: number };
  amenities: string[];
  safety_rating: number;
  nearby_landmarks: string[];
}

// UUID validation regex
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

@Injectable()
export class AiAgentService {
  private readonly logger = new Logger(AiAgentService.name);
  private anthropic: Anthropic;
  private systemPrompt: string;
  private readonly MAX_TOOL_ITERATIONS = 10; // Prevent infinite loops

  constructor(
    private configService: ConfigService,
    private propertiesService: PropertiesService,
    private bookingsService: BookingsService,
    private inquiriesService: InquiriesService,
    private supportService: SupportService,
    private viewingsService: ViewingsService,
  ) {
    const apiKey = this.configService.get<string>('ANTHROPIC_API_KEY');

    if (!apiKey) {
      this.logger.error('ANTHROPIC_API_KEY is not configured');
      throw new Error('ANTHROPIC_API_KEY environment variable is required');
    }

    this.anthropic = new Anthropic({ apiKey });
    this.systemPrompt = this.loadSystemPrompt();
  }

  async chat(
    userId: string,
    message: string,
    conversationHistory: Message[] = [],
  ): Promise<ChatResponse> {
    // Validate userId
    if (!this.isValidUUID(userId)) {
      throw new BadRequestException('Invalid user ID format');
    }

    const messages: Message[] = [
      ...conversationHistory,
      { role: 'user', content: message },
    ];

    const toolsUsed: string[] = [];
    let iterations = 0;

    try {
      let response = await this.callAnthropicAPI(messages);

      // Handle chained tool calls (loop until no more tool use)
      while (
        response.stop_reason === 'tool_use' &&
        iterations < this.MAX_TOOL_ITERATIONS
      ) {
        iterations++;

        // Find all tool use blocks in the response
        const toolUseBlocks = response.content.filter(
          (block): block is ToolUseBlock => block.type === 'tool_use',
        );

        if (toolUseBlocks.length === 0) {
          break;
        }

        // Add assistant's response to messages
        messages.push({ role: 'assistant', content: response.content });

        // Execute all tool calls and collect results
        const toolResults: ToolResult[] = await Promise.all(
          toolUseBlocks.map(async (toolBlock) => {
            toolsUsed.push(toolBlock.name);

            try {
              const result = await this.executeToolCall(
                toolBlock.name,
                toolBlock.input,
                userId,
              );

              return {
                type: 'tool_result' as const,
                tool_use_id: toolBlock.id,
                content: JSON.stringify(result),
              };
            } catch (error) {
              this.logger.error(
                `Tool execution failed: ${toolBlock.name}`,
                error instanceof Error ? error.stack : error,
              );

              return {
                type: 'tool_result' as const,
                tool_use_id: toolBlock.id,
                content: JSON.stringify({
                  error: true,
                  message: error instanceof Error ? error.message : 'Tool execution failed',
                }),
                is_error: true,
              };
            }
          }),
        );

        // Add tool results to messages
        messages.push({ role: 'user', content: toolResults });

        // Get next response from Claude
        response = await this.callAnthropicAPI(messages);
      }

      // Check for max iterations exceeded
      if (iterations >= this.MAX_TOOL_ITERATIONS) {
        this.logger.warn(`Max tool iterations (${this.MAX_TOOL_ITERATIONS}) reached for user ${userId}`);
      }

      // Add final assistant response to history
      messages.push({ role: 'assistant', content: response.content });

      return {
        message: this.extractTextFromResponse(response),
        toolsUsed: toolsUsed.length > 0 ? toolsUsed : undefined,
        conversationHistory: messages,
      };
    } catch (error) {
      this.logger.error('Chat error', error instanceof Error ? error.stack : error);

      if (error instanceof HttpException) {
        throw error;
      }

      // Handle Anthropic API specific errors
      if (error instanceof Anthropic.APIError) {
        if (error.status === 429) {
          throw new HttpException(
            'AI service is busy. Please try again in a moment.',
            HttpStatus.TOO_MANY_REQUESTS,
          );
        }
        if (error.status === 401) {
          throw new HttpException(
            'AI service authentication failed',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      }

      throw new HttpException(
        'AI service temporarily unavailable',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  private async callAnthropicAPI(messages: Message[]) {
    return await this.anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: this.systemPrompt,
      messages: messages as Anthropic.MessageParam[],
      tools: this.getToolDefinitions(),
    });
  }

  private async executeToolCall(
    toolName: string,
    input: Record<string, unknown>,
    userId: string,
  ): Promise<unknown> {
    this.logger.debug(`Executing tool: ${toolName}`, { input, userId });

    switch (toolName) {
      case 'search_properties': {
        const params = input as SearchPropertiesInput;
        return await this.propertiesService.search(params);
      }

      case 'get_property_details': {
        const propertyId = input.property_id as string;
        this.validateUUID(propertyId, 'property_id');
        return await this.propertiesService.findOne(propertyId);
      }

      case 'search_hotels': {
        const params = input as SearchHotelsInput;
        this.validateDateRange(params.check_in, params.check_out);
        return await this.propertiesService.searchHotels(
          params.location,
          params.check_in,
          params.check_out,
          params.guests || 1,
          params.price_max,
        );
      }

      case 'check_availability': {
        const params = input as AvailabilityInput;
        this.validateUUID(params.property_id, 'property_id');
        this.validateDateRange(params.check_in, params.check_out);
        return await this.bookingsService.checkAvailability(
          params.property_id,
          params.check_in,
          params.check_out,
        );
      }

      case 'calculate_booking_price': {
        const params = input as BookingPriceInput;
        this.validateUUID(params.property_id, 'property_id');
        this.validateDateRange(params.check_in, params.check_out);
        return await this.bookingsService.calculatePrice(
          params.property_id,
          params.check_in,
          params.check_out,
          params.guests || 1,
        );
      }

      case 'get_user_bookings': {
        const status = (input.status as string) || 'all';
        return await this.bookingsService.getUserBookings(userId, status);
      }

      case 'get_user_favorites': {
        return await this.propertiesService.getUserFavorites(userId);
      }

      case 'add_to_favorites': {
        const propertyId = input.property_id as string;
        this.validateUUID(propertyId, 'property_id');
        return await this.propertiesService.addToFavorites(userId, propertyId);
      }

      case 'create_inquiry': {
        const propertyId = input.property_id as string;
        const message = input.message as string;
        this.validateUUID(propertyId, 'property_id');

        if (!message || message.trim().length === 0) {
          throw new BadRequestException('Inquiry message cannot be empty');
        }

        return await this.inquiriesService.create({
          propertyId,
          userId,
          message: message.trim(),
        });
      }

      case 'get_neighborhood_info': {
        const neighborhood = input.neighborhood as string;
        const info = this.getNeighborhoodInfo(neighborhood);

        if (!info) {
          return {
            found: false,
            message: `No information available for "${neighborhood}". Try searching for GRA, Ikpoba Hill, Uselu, Ring Road, Sapele Road, or Auchi.`,
          };
        }

        return { found: true, data: info };
      }

      case 'escalate_to_human': {
        const params = input as EscalateInput;
        return await this.createSupportTicket(userId, params);
      }

      case 'schedule_viewing': {
        const params = input as ScheduleViewingInput;
        this.validateUUID(params.property_id, 'property_id');
        this.validateFutureDate(params.preferred_date);
        return await this.scheduleViewing(userId, params);
      }

      default:
        this.logger.error(`Unknown tool called: ${toolName}`, { input, userId });
        throw new NotFoundException(`Tool '${toolName}' is not implemented`);
    }
  }

  private getToolDefinitions(): Anthropic.Tool[] {
    return [
      {
        name: 'search_properties',
        description: 'Search for properties in EdoConnect database based on filters. Use this to find land, houses, apartments, duplexes, bungalows, or commercial properties in Edo State.',
        input_schema: {
          type: 'object' as const,
          properties: {
            location: {
              type: 'string',
              description: "City, LGA, or neighborhood (e.g., 'GRA Benin City', 'Ikpoba Hill', 'Edo State')",
            },
            property_type: {
              type: 'string',
              enum: ['land', 'house', 'apartment', 'duplex', 'bungalow', 'commercial', 'hotel_room', 'all'],
              description: 'Type of property to search for',
            },
            purpose: {
              type: 'string',
              enum: ['sale', 'rent', 'shortlet', 'all'],
              description: 'Property listing purpose',
            },
            price_min: {
              type: 'number',
              description: 'Minimum price in Naira',
            },
            price_max: {
              type: 'number',
              description: 'Maximum price in Naira',
            },
            bedrooms_min: {
              type: 'integer',
              description: 'Minimum number of bedrooms',
            },
            bathrooms_min: {
              type: 'integer',
              description: 'Minimum number of bathrooms',
            },
            amenities: {
              type: 'array',
              items: { type: 'string' },
              description: "Required amenities (e.g., ['parking', 'pool', '24hr_power'])",
            },
            verified_only: {
              type: 'boolean',
              description: 'Only show verified properties',
            },
            featured_only: {
              type: 'boolean',
              description: 'Only show featured properties',
            },
            limit: {
              type: 'integer',
              description: 'Maximum number of results to return (default: 5)',
            },
          },
          required: ['location'],
        },
      },
      {
        name: 'get_property_details',
        description: 'Get detailed information about a specific property including photos, amenities, agent contact, and full description.',
        input_schema: {
          type: 'object' as const,
          properties: {
            property_id: {
              type: 'string',
              description: 'Unique property identifier (UUID format)',
            },
          },
          required: ['property_id'],
        },
      },
      {
        name: 'search_hotels',
        description: 'Search for available hotels and shortlet accommodations with specific check-in and check-out dates.',
        input_schema: {
          type: 'object' as const,
          properties: {
            location: {
              type: 'string',
              description: "City or area (e.g., 'Benin City', 'Auchi')",
            },
            check_in: {
              type: 'string',
              description: 'Check-in date (YYYY-MM-DD format)',
            },
            check_out: {
              type: 'string',
              description: 'Check-out date (YYYY-MM-DD format)',
            },
            guests: {
              type: 'integer',
              description: 'Number of guests (default: 1)',
            },
            price_max: {
              type: 'number',
              description: 'Maximum price per night in Naira',
            },
          },
          required: ['location', 'check_in', 'check_out'],
        },
      },
      {
        name: 'check_availability',
        description: 'Check if a specific hotel or shortlet property is available for the given dates.',
        input_schema: {
          type: 'object' as const,
          properties: {
            property_id: {
              type: 'string',
              description: 'Property UUID',
            },
            check_in: {
              type: 'string',
              description: 'Check-in date (YYYY-MM-DD)',
            },
            check_out: {
              type: 'string',
              description: 'Check-out date (YYYY-MM-DD)',
            },
          },
          required: ['property_id', 'check_in', 'check_out'],
        },
      },
      {
        name: 'calculate_booking_price',
        description: 'Calculate the total booking cost including all fees, taxes, and charges for a property reservation.',
        input_schema: {
          type: 'object' as const,
          properties: {
            property_id: {
              type: 'string',
              description: 'Property UUID',
            },
            check_in: {
              type: 'string',
              description: 'Check-in date (YYYY-MM-DD)',
            },
            check_out: {
              type: 'string',
              description: 'Check-out date (YYYY-MM-DD)',
            },
            guests: {
              type: 'integer',
              description: 'Number of guests (default: 1)',
            },
          },
          required: ['property_id', 'check_in', 'check_out'],
        },
      },
      {
        name: 'get_user_bookings',
        description: "Retrieve the user's booking history including upcoming, past, and cancelled reservations.",
        input_schema: {
          type: 'object' as const,
          properties: {
            status: {
              type: 'string',
              enum: ['all', 'upcoming', 'past', 'cancelled'],
              description: "Filter bookings by status (default: 'all')",
            },
          },
          required: [],
        },
      },
      {
        name: 'get_user_favorites',
        description: "Get the user's saved/favorited properties list.",
        input_schema: {
          type: 'object' as const,
          properties: {},
          required: [],
        },
      },
      {
        name: 'add_to_favorites',
        description: "Add a property to the user's favorites/saved list for later viewing.",
        input_schema: {
          type: 'object' as const,
          properties: {
            property_id: {
              type: 'string',
              description: 'Property UUID to add to favorites',
            },
          },
          required: ['property_id'],
        },
      },
      {
        name: 'create_inquiry',
        description: 'Send an inquiry message to the property owner or agent about a specific property.',
        input_schema: {
          type: 'object' as const,
          properties: {
            property_id: {
              type: 'string',
              description: 'Property UUID',
            },
            message: {
              type: 'string',
              description: "User's inquiry message to the property owner/agent",
            },
          },
          required: ['property_id', 'message'],
        },
      },
      {
        name: 'get_neighborhood_info',
        description: 'Get detailed information about a neighborhood in Edo State including average prices, amenities, safety rating, and nearby landmarks.',
        input_schema: {
          type: 'object' as const,
          properties: {
            neighborhood: {
              type: 'string',
              description: "Neighborhood name (e.g., 'GRA', 'Ikpoba Hill', 'Uselu')",
            },
          },
          required: ['neighborhood'],
        },
      },
      {
        name: 'escalate_to_human',
        description: 'Create a support ticket and escalate the conversation to a human agent. Use this when the user has a complex issue, complaint, or requests human assistance.',
        input_schema: {
          type: 'object' as const,
          properties: {
            issue_type: {
              type: 'string',
              enum: ['payment', 'booking', 'technical', 'complaint', 'fraud', 'other'],
              description: 'Category of the issue',
            },
            context: {
              type: 'string',
              description: 'Brief description of the issue and conversation context',
            },
            urgency: {
              type: 'string',
              enum: ['low', 'medium', 'high', 'critical'],
              description: "Urgency level (default: 'medium')",
            },
          },
          required: ['issue_type', 'context'],
        },
      },
      {
        name: 'schedule_viewing',
        description: 'Schedule a property viewing appointment with the agent or property owner.',
        input_schema: {
          type: 'object' as const,
          properties: {
            property_id: {
              type: 'string',
              description: 'Property UUID',
            },
            preferred_date: {
              type: 'string',
              description: 'Preferred viewing date (YYYY-MM-DD)',
            },
            preferred_time: {
              type: 'string',
              description: "Preferred time slot (e.g., 'morning', 'afternoon', 'evening', or specific time like '10:00 AM')",
            },
            notes: {
              type: 'string',
              description: 'Any additional notes or requirements for the viewing',
            },
          },
          required: ['property_id', 'preferred_date'],
        },
      },
    ];
  }

  private extractTextFromResponse(response: Anthropic.Message): string {
    const textBlocks = response.content.filter(
      (block): block is Anthropic.TextBlock => block.type === 'text',
    );
    return textBlocks.map((block) => block.text).join('\n');
  }

  private loadSystemPrompt(): string {
    // Try to load from config first, then fall back to default
    const configPrompt = this.configService.get<string>('AI_SYSTEM_PROMPT');

    if (configPrompt) {
      return configPrompt;
    }

    // Default comprehensive system prompt
    return `You are EdoConnect AI Assistant, a helpful and knowledgeable real estate assistant for properties in Edo State, Nigeria.

## Your Role
- Help users find properties (land, houses, apartments, duplexes, commercial spaces) in Edo State
- Assist with hotel and shortlet bookings
- Schedule property viewings
- Answer questions about neighborhoods in Benin City, Auchi, Ekpoma, and other areas
- Provide accurate pricing information in Nigerian Naira (₦)

## Guidelines
1. Always be polite, professional, and helpful
2. Use the available tools to search for properties and get accurate information
3. When showing prices, always format them in Naira (e.g., ₦5,000,000)
4. If you don't have information, say so honestly and offer to connect the user with a human agent
5. For complex issues or complaints, use the escalate_to_human tool
6. Respect user privacy - never share personal information

## Key Locations in Edo State
- Benin City (Capital): GRA, Ikpoba Hill, Uselu, Ring Road, Sapele Road, Ugbowo, Ekenwan
- Auchi: Commercial hub in Etsako West LGA
- Ekpoma: University town in Esan West LGA
- Uromi, Irrua, Ubiaja, and other LGA headquarters

## Response Style
- Be concise but informative
- Use bullet points for listing multiple properties or options
- Always confirm user requirements before searching
- Offer alternatives if exact matches aren't available
- End responses with a helpful follow-up question when appropriate`;
  }

  private getNeighborhoodInfo(neighborhood: string): NeighborhoodInfo | null {
    // Normalize the input for matching
    const normalizedInput = neighborhood.toLowerCase().trim();

    const neighborhoodData: Record<string, NeighborhoodInfo> = {
      'gra': {
        name: 'Government Reserved Area (GRA)',
        description: 'The most prestigious and upscale neighborhood in Benin City. Known for its well-planned layout, tree-lined streets, and high-end properties. Popular among expatriates, business executives, and wealthy families.',
        average_price_sale: { min: 15000000, max: 350000000 },
        average_price_rent: { min: 800000, max: 4000000 },
        amenities: ['24hr power supply', 'gated estates', 'tarred roads', 'international schools', 'private hospitals', 'shopping centers'],
        safety_rating: 5,
        nearby_landmarks: ['Oba Palace', 'Ring Road', 'Benin Airport', 'Central Hospital'],
      },
      'ikpoba hill': {
        name: 'Ikpoba Hill',
        description: 'A rapidly developing residential area with a mix of affordable and mid-range properties. Good for families and young professionals. Close to commercial areas and well-connected to other parts of the city.',
        average_price_sale: { min: 8000000, max: 80000000 },
        average_price_rent: { min: 300000, max: 1500000 },
        amenities: ['schools', 'markets', 'hospitals', 'public transportation'],
        safety_rating: 4,
        nearby_landmarks: ['Ikpoba River', 'New Benin Market', 'UNIBEN Teaching Hospital'],
      },
      'uselu': {
        name: 'Uselu',
        description: 'A vibrant area near the University of Benin. Popular with students, academics, and young professionals. Known for its bustling atmosphere and affordable housing options.',
        average_price_sale: { min: 5000000, max: 50000000 },
        average_price_rent: { min: 150000, max: 800000 },
        amenities: ['university facilities', 'student hostels', 'restaurants', 'cyber cafes', 'markets'],
        safety_rating: 3,
        nearby_landmarks: ['University of Benin', 'UBTH', 'Uselu Market', 'Isihor'],
      },
      'ring road': {
        name: 'Ring Road',
        description: 'A major commercial and residential corridor in Benin City. Features a mix of residential properties and commercial establishments. Well-connected with good road networks.',
        average_price_sale: { min: 10000000, max: 150000000 },
        average_price_rent: { min: 400000, max: 2500000 },
        amenities: ['banks', 'shopping plazas', 'hotels', 'restaurants', 'hospitals'],
        safety_rating: 4,
        nearby_landmarks: ['Oba Market', 'Kings Square', 'Central Bank', 'Edo State Secretariat'],
      },
      'sapele road': {
        name: 'Sapele Road',
        description: 'One of the busiest commercial corridors in Benin City. Features a mix of commercial and residential properties. Well-suited for businesses and those who prefer living close to commercial activities.',
        average_price_sale: { min: 12000000, max: 200000000 },
        average_price_rent: { min: 500000, max: 3000000 },
        amenities: ['markets', 'banks', 'hotels', 'restaurants', 'mechanic villages'],
        safety_rating: 3,
        nearby_landmarks: ['Sapele Road Flyover', 'Textile Mill Road', 'Airport Road Junction'],
      },
      'auchi': {
        name: 'Auchi',
        description: 'The commercial hub of Etsako West LGA and one of the largest towns in Edo North. Home to Auchi Polytechnic and known for its vibrant trading activities. Properties are generally more affordable than Benin City.',
        average_price_sale: { min: 3000000, max: 50000000 },
        average_price_rent: { min: 100000, max: 600000 },
        amenities: ['polytechnic', 'markets', 'hospitals', 'banks', 'hotels'],
        safety_rating: 4,
        nearby_landmarks: ['Auchi Polytechnic', 'Jattu Market', 'General Hospital Auchi', 'Igarra Road'],
      },
      'ekpoma': {
        name: 'Ekpoma',
        description: 'University town hosting Ambrose Alli University. A peaceful academic environment with affordable housing. Popular with students, lecturers, and university staff.',
        average_price_sale: { min: 2500000, max: 40000000 },
        average_price_rent: { min: 80000, max: 400000 },
        amenities: ['university', 'student housing', 'markets', 'hospitals'],
        safety_rating: 4,
        nearby_landmarks: ['Ambrose Alli University', 'Ekpoma Main Market', 'General Hospital Ekpoma'],
      },
      'ugbowo': {
        name: 'Ugbowo',
        description: 'Adjacent to the University of Benin, Ugbowo is a bustling neighborhood popular with students and young professionals. Known for affordable rentals and vibrant nightlife.',
        average_price_sale: { min: 6000000, max: 60000000 },
        average_price_rent: { min: 120000, max: 700000 },
        amenities: ['student housing', 'restaurants', 'bars', 'markets', 'banks'],
        safety_rating: 3,
        nearby_landmarks: ['UNIBEN Main Gate', 'Ugbowo Market', 'Ekosodin'],
      },
      'ekenwan': {
        name: 'Ekenwan',
        description: 'A developing residential area along the Benin-Sapele Road axis. Offers relatively affordable land and properties with good potential for appreciation.',
        average_price_sale: { min: 4000000, max: 45000000 },
        average_price_rent: { min: 150000, max: 600000 },
        amenities: ['schools', 'churches', 'markets', 'filling stations'],
        safety_rating: 3,
        nearby_landmarks: ['Ekenwan Campus (UNIBEN)', 'Ohovbe', 'Santana Market'],
      },
    };

    // Find matching neighborhood (case-insensitive)
    const key = Object.keys(neighborhoodData).find(
      (k) => normalizedInput.includes(k) || k.includes(normalizedInput),
    );

    return key ? neighborhoodData[key] : null;
  }

  private async createSupportTicket(
    userId: string,
    input: EscalateInput,
  ): Promise<{
    id: string;
    status: string;
    estimatedResponseTime: string;
    message: string;
  }> {
    const urgency = input.urgency || 'medium';

    const ticket = await this.supportService.create({
      userId,
      type: input.issue_type,
      description: input.context,
      urgency,
    });

    const estimatedResponseTime = this.getEstimatedResponseTime(urgency);

    return {
      id: ticket.id,
      status: 'open',
      estimatedResponseTime,
      message: `Your support ticket has been created. A human agent will respond within ${estimatedResponseTime}. Your ticket ID is ${ticket.id}.`,
    };
  }

  private getEstimatedResponseTime(urgency: string): string {
    const times: Record<string, string> = {
      critical: '15 minutes',
      high: '1 hour',
      medium: '2 hours',
      low: '24 hours',
    };
    return times[urgency] || '2 hours';
  }

  private async scheduleViewing(
    userId: string,
    input: ScheduleViewingInput,
  ): Promise<{
    id: string;
    propertyId: string;
    preferredDate: string;
    preferredTime: string | null;
    status: string;
    message: string;
  }> {
    const viewing = await this.viewingsService.create({
      userId,
      propertyId: input.property_id,
      preferredDate: input.preferred_date,
      preferredTime: input.preferred_time,
      notes: input.notes,
    });

    return {
      id: viewing.id,
      propertyId: input.property_id,
      preferredDate: input.preferred_date,
      preferredTime: input.preferred_time || null,
      status: 'pending',
      message: `Your viewing request has been submitted for ${input.preferred_date}${input.preferred_time ? ` at ${input.preferred_time}` : ''}. The property agent will confirm within 24 hours. Your viewing ID is ${viewing.id}.`,
    };
  }

  // Validation helpers
  private isValidUUID(id: string): boolean {
    return UUID_REGEX.test(id);
  }

  private validateUUID(id: string, fieldName: string): void {
    if (!id || !this.isValidUUID(id)) {
      throw new BadRequestException(`Invalid ${fieldName} format. Expected UUID.`);
    }
  }

  private validateDateRange(checkIn: string, checkOut: string): void {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(checkInDate.getTime())) {
      throw new BadRequestException('Invalid check-in date format. Use YYYY-MM-DD.');
    }

    if (isNaN(checkOutDate.getTime())) {
      throw new BadRequestException('Invalid check-out date format. Use YYYY-MM-DD.');
    }

    if (checkInDate < today) {
      throw new BadRequestException('Check-in date cannot be in the past.');
    }

    if (checkOutDate <= checkInDate) {
      throw new BadRequestException('Check-out date must be after check-in date.');
    }
  }

  private validateFutureDate(dateStr: string): void {
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(date.getTime())) {
      throw new BadRequestException('Invalid date format. Use YYYY-MM-DD.');
    }

    if (date < today) {
      throw new BadRequestException('Date cannot be in the past.');
    }
  }
}
