# CLAUDE.md - AI Assistant Guidelines for edo-connect

This document provides context and guidelines for AI assistants working on the edo-connect project.

## Project Overview

**Project Name**: edo-connect (EdoConnect)
**Type**: Real Estate & Property Platform
**Target Market**: Edo State, Nigeria
**Currency**: Nigerian Naira (NGN/₦)
**Framework**: NestJS (Node.js/TypeScript)
**AI Integration**: Anthropic Claude API
**Repository**: patrickehapa1996-oss/edo-connect

### Description

EdoConnect is a comprehensive real estate platform serving Edo State, Nigeria. The platform enables users to:
- Search and browse properties (land, houses, apartments, duplexes, commercial spaces)
- Book hotels and short-term rentals
- Schedule property viewings
- Contact property owners/agents
- Save favorite properties
- Access neighborhood information
- Chat with an AI assistant powered by Claude

### Key Locations

The platform primarily serves these areas in Edo State:
- **Benin City** (State Capital)
  - GRA (Government Reserved Area)
  - Ikpoba Hill
  - Uselu
  - Ring Road
  - Sapele Road
- **Auchi**
- **Ekpoma**
- Other Local Government Areas (LGAs)

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend Framework | NestJS |
| Language | TypeScript |
| AI/LLM | Anthropic Claude API (`claude-sonnet-4-20250514`) |
| Configuration | `@nestjs/config` (ConfigService) |
| Runtime | Node.js |

## Repository Structure

```
edo-connect/
├── src/
│   ├── ai-agent/
│   │   ├── ai-agent.module.ts       # AI agent NestJS module
│   │   ├── ai-agent.controller.ts   # Chat endpoint controller
│   │   ├── ai-agent.service.ts      # Claude AI integration service
│   │   ├── dto/
│   │   │   └── chat.dto.ts          # Request/response DTOs
│   │   └── interfaces/
│   │       └── tool-inputs.interface.ts  # Tool input types
│   ├── properties/
│   │   ├── properties.module.ts     # Properties module
│   │   └── properties.service.ts    # Property search & management
│   ├── bookings/
│   │   ├── bookings.module.ts       # Bookings module
│   │   └── bookings.service.ts      # Booking & availability logic
│   ├── inquiries/
│   │   ├── inquiries.module.ts      # Inquiries module
│   │   └── inquiries.service.ts     # User inquiries handling
│   ├── support/
│   │   ├── support.module.ts        # Support module
│   │   └── support.service.ts       # Support ticket management
│   ├── viewings/
│   │   ├── viewings.module.ts       # Viewings module
│   │   └── viewings.service.ts      # Property viewing scheduling
│   └── auth/
│       └── guards/
│           └── jwt-auth.guard.ts    # JWT authentication guard
├── CLAUDE.md
├── README.md
└── package.json
```

## AI Agent Architecture

### Overview

The platform includes an AI-powered chat agent (`AiAgentService`) that uses Claude with function calling (tool use) to assist users with property searches, bookings, and inquiries.

### Key File: `src/ai-agent/ai-agent.service.ts`

```typescript
@Injectable()
export class AiAgentService {
  // Dependencies injected:
  // - ConfigService: Environment configuration
  // - PropertiesService: Property operations
  // - BookingsService: Booking operations
  // - InquiriesService: Inquiry operations
}
```

### Chat Flow

1. User sends message via `chat(userId, message, conversationHistory)`
2. Message sent to Claude API with system prompt and tool definitions
3. If Claude requests tool use (`stop_reason === 'tool_use'`):
   - Extract tool name and input from response
   - Execute tool via `executeToolCall()`
   - Send tool result back to Claude
   - Return Claude's follow-up response
4. Return final response to user

### Tool Execution Pattern

```typescript
private async executeToolCall(toolName: string, input: any, userId: string) {
  switch (toolName) {
    case 'search_properties':
      return await this.propertiesService.search(input);
    case 'get_property_details':
      return await this.propertiesService.findOne(input.property_id);
    // ... other tools
  }
}
```

### Important Implementation Notes

- **User ID Injection**: The `userId` is passed to tool calls for user-specific operations (favorites, bookings, inquiries)
- **Conversation History**: Maintained between calls for context continuity
- **Tool Results**: Always JSON stringified before sending back to Claude
- **Response Extraction**: Text blocks extracted from Claude's response via `extractTextFromResponse()`

## API Functions Reference

The platform exposes the following core functions as Claude tools:

### Property Search & Discovery

| Function | Description | Required Params |
|----------|-------------|-----------------|
| `search_properties` | Search properties with filters | `location` |
| `get_property_details` | Get detailed property info | `property_id` |
| `search_hotels` | Search available hotels | `location`, `check_in`, `check_out` |
| `get_neighborhood_info` | Get neighborhood details | `neighborhood` |

### Booking & Availability

| Function | Description | Required Params |
|----------|-------------|-----------------|
| `check_availability` | Check property availability | `property_id`, `check_in`, `check_out` |
| `calculate_booking_price` | Calculate total booking cost | `property_id`, `check_in`, `check_out` |
| `get_user_bookings` | Retrieve booking history | `user_id` |

### User Interactions

| Function | Description | Required Params |
|----------|-------------|-----------------|
| `add_to_favorites` | Save property to favorites | `user_id`, `property_id` |
| `get_user_favorites` | Get saved properties | `user_id` |
| `create_inquiry` | Send inquiry to owner/agent | `property_id`, `user_id`, `message` |
| `schedule_viewing` | Book property viewing | `property_id`, `user_id`, `preferred_date` |

### Support

| Function | Description | Required Params |
|----------|-------------|-----------------|
| `escalate_to_human` | Escalate to human support | `issue_type`, `context` |

## Domain Knowledge

### Property Types

```
land        - Vacant land/plots
house       - Standalone houses
apartment   - Apartment units
duplex      - Duplex buildings
bungalow    - Single-story buildings
commercial  - Commercial/office spaces
hotel_room  - Hotel accommodations
```

### Listing Purposes

```
sale     - Properties for purchase
rent     - Long-term rentals
shortlet - Short-term/vacation rentals
```

### Common Amenities

- `parking` - Parking space
- `pool` - Swimming pool
- `24hr_power` - 24-hour electricity/generator
- `security` - Security services
- `borehole` - Water borehole
- `furnished` - Furnished property

### Neighborhood Data Structure

```typescript
{
  name: string;                    // Full name
  description: string;             // Area description
  average_price_sale: { min, max }; // Sale price range (NGN)
  average_price_rent: { min, max }; // Rent price range (NGN/year)
  amenities: string[];             // Available amenities
  safety_rating: number;           // 1-5 scale
  nearby_landmarks: string[];      // Notable locations
}
```

### Support Ticket Structure

```typescript
{
  id: string;              // Format: EDO-SUP-{timestamp}
  userId: string;
  type: IssueType;
  description: string;
  urgency: UrgencyLevel;
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: Date;
  estimatedResponseTime: string;
}
```

### Viewing Request Structure

```typescript
{
  id: string;              // Format: EDO-VIEW-{timestamp}
  propertyId: string;
  userId: string;
  preferredDate: string;
  preferredTime: string;
  notes: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}
```

### Urgency Response Times

| Level | Response Time |
|-------|---------------|
| `critical` | 15 minutes |
| `high` | 1 hour |
| `medium` | 2 hours |
| `low` | 24 hours |

## Development Guidelines

### Git Workflow

1. **Branch Naming**: Use descriptive branch names following the pattern:
   - `feature/<description>` - For new features
   - `fix/<description>` - For bug fixes
   - `refactor/<description>` - For code refactoring
   - `docs/<description>` - For documentation updates

2. **Commit Messages**: Write clear, concise commit messages:
   - Use imperative mood ("Add feature" not "Added feature")
   - First line should be under 72 characters
   - Include context in the body when necessary

3. **Pull Requests**:
   - Include a clear description of changes
   - Reference any related issues
   - Ensure all tests pass before requesting review

### Code Conventions

1. **NestJS Patterns**:
   - Use `@Injectable()` decorator for services
   - Inject dependencies via constructor
   - Follow NestJS module structure
   - Use ConfigService for environment variables

2. **Naming Conventions**:
   - Use `snake_case` for API/tool parameters
   - Use `camelCase` for TypeScript variables and methods
   - Use `PascalCase` for classes and interfaces
   - Use `SCREAMING_SNAKE_CASE` for constants

3. **TypeScript**:
   - Define interfaces for all data structures
   - Use strict type checking
   - Avoid `any` type when possible

4. **Error Handling**:
   - Handle errors gracefully
   - Provide meaningful error messages
   - Log errors appropriately for debugging
   - Use NestJS exception filters

### Testing

When testing:
- Write unit tests for services
- Mock external API calls (Anthropic)
- Test tool execution paths
- Test with Nigerian Naira currency values
- Test with Edo State location data

## Commands Reference

```bash
# Install dependencies
npm install

# Run development server
npm run start:dev

# Build for production
npm run build

# Run production server
npm run start:prod

# Run tests
npm test

# Run tests with coverage
npm run test:cov

# Lint code
npm run lint
```

## Environment Variables

```bash
# Required
ANTHROPIC_API_KEY=         # Claude API key
DATABASE_URL=              # Database connection string

# Application
JWT_SECRET=                # JWT signing secret
API_SECRET=                # Internal API secret
PAYMENT_GATEWAY_KEY=       # Payment processor key

# Optional
NODE_ENV=development       # Environment mode
PORT=3000                  # Server port
```

## AI Assistant Best Practices

When working on this codebase:

1. **Read Before Modifying**: Always read and understand existing code before making changes.

2. **Minimal Changes**: Make focused, minimal changes that directly address the task at hand. Avoid unnecessary refactoring.

3. **Preserve Patterns**: Follow existing NestJS patterns and conventions in the codebase.

4. **Test Changes**: Verify changes work correctly and don't break existing functionality.

5. **Security Awareness**:
   - Never commit secrets or credentials (especially `ANTHROPIC_API_KEY`)
   - Validate user inputs (especially property IDs, user IDs)
   - Sanitize outputs
   - Follow OWASP guidelines
   - Validate UUIDs for property_id and user_id parameters

6. **Nigerian Context**:
   - Use Nigerian Naira (₦) for all monetary values
   - Respect local date formats
   - Be familiar with Edo State geography
   - Support local phone number formats (+234)

7. **Claude API Integration**:
   - Keep tool definitions in sync with service implementations
   - Handle tool use responses properly
   - Maintain conversation history format
   - Handle API errors gracefully

8. **Documentation Updates**: Update this CLAUDE.md when making significant changes.

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Claude API returns empty response | Check `ANTHROPIC_API_KEY` is set correctly |
| Tool execution fails | Verify service method exists and parameters match |
| Conversation context lost | Ensure `conversationHistory` is passed correctly |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Submit a pull request

---

**Last Updated**: January 2026
**Maintained By**: AI Assistant (Claude)

> This document should be updated as the project evolves. When adding new features, dependencies, or changing workflows, please update the relevant sections.
