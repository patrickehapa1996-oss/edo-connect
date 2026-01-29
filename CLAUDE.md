# CLAUDE.md - AI Assistant Guidelines for edo-connect

This document provides context and guidelines for AI assistants working on the edo-connect project.

## Project Overview

**Project Name**: edo-connect (EdoConnect)
**Type**: Real Estate & Property Platform
**Target Market**: Edo State, Nigeria
**Currency**: Nigerian Naira (NGN/₦)
**Status**: Initial Setup Phase
**Repository**: patrickehapa1996-oss/edo-connect

### Description

EdoConnect is a comprehensive real estate platform serving Edo State, Nigeria. The platform enables users to:
- Search and browse properties (land, houses, apartments, duplexes, commercial spaces)
- Book hotels and short-term rentals
- Schedule property viewings
- Contact property owners/agents
- Save favorite properties
- Access neighborhood information

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

## Repository Structure

```
edo-connect/
├── CLAUDE.md          # AI assistant guidelines (this file)
├── README.md          # Project documentation
└── .git/              # Git version control
```

> **Note**: Update this section as the project structure evolves.

## API Functions Reference

The platform exposes the following core functions:

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

### Issue Types (for escalation)

```
payment   - Payment-related issues
booking   - Booking problems
technical - Technical/app issues
complaint - General complaints
fraud     - Fraud reports
other     - Other issues
```

### Urgency Levels

```
low      - Can wait
medium   - Normal priority (default)
high     - Needs prompt attention
critical - Immediate attention required
```

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

> **Note**: Update this section once the tech stack is established.

1. **Code Quality**:
   - Write clean, readable, and maintainable code
   - Follow the principle of single responsibility
   - Keep functions small and focused
   - Use meaningful variable and function names

2. **Naming Conventions**:
   - Use `snake_case` for API parameters (as defined in the API schema)
   - Use `camelCase` for JavaScript/TypeScript variables
   - Use `PascalCase` for components and classes
   - Use `SCREAMING_SNAKE_CASE` for constants

3. **Documentation**:
   - Document public APIs and complex logic
   - Keep comments up to date with code changes
   - Use JSDoc/TSDoc for JavaScript/TypeScript projects

4. **Error Handling**:
   - Handle errors gracefully
   - Provide meaningful error messages in English and Pidgin where appropriate
   - Log errors appropriately for debugging

### Testing

> **Note**: Update this section once the testing framework is configured.

When testing is set up:
- Write unit tests for new functionality
- Test with Nigerian Naira currency values
- Test with Edo State location data
- Maintain or improve code coverage
- Run tests before committing changes

## Commands Reference

> **Note**: Update this section once package.json and scripts are configured.

```bash
# Install dependencies
# npm install

# Run development server
# npm run dev

# Build for production
# npm run build

# Run tests
# npm test

# Lint code
# npm run lint
```

## Architecture

### Core Modules

1. **Property Module** - Search, details, favorites
2. **Booking Module** - Availability, pricing, reservations
3. **User Module** - Profiles, bookings history, favorites
4. **Inquiry Module** - Messages, viewing schedules
5. **Support Module** - Human escalation, tickets

### Data Models

Key entities to implement:
- `Property` - Real estate listings
- `User` - Platform users
- `Booking` - Reservations
- `Inquiry` - User inquiries
- `Viewing` - Scheduled viewings
- `Neighborhood` - Location information
- `SupportTicket` - Escalated issues

### External Dependencies

_To be documented as the project develops._

## Environment Setup

### Prerequisites

- Node.js (version TBD)
- npm or yarn
- Database (TBD)

### Environment Variables

Expected environment variables:
```
DATABASE_URL=
API_SECRET=
JWT_SECRET=
PAYMENT_GATEWAY_KEY=
```

### Local Development

1. Clone the repository
2. Install dependencies
3. Configure environment variables
4. Start development server

## AI Assistant Best Practices

When working on this codebase:

1. **Read Before Modifying**: Always read and understand existing code before making changes.

2. **Minimal Changes**: Make focused, minimal changes that directly address the task at hand. Avoid unnecessary refactoring.

3. **Preserve Patterns**: Follow existing code patterns and conventions in the codebase.

4. **Test Changes**: Verify changes work correctly and don't break existing functionality.

5. **Security Awareness**: Be mindful of security implications:
   - Never commit secrets or credentials
   - Validate user inputs (especially property IDs, user IDs)
   - Sanitize outputs
   - Follow OWASP guidelines
   - Validate UUIDs for property_id and user_id parameters

6. **Nigerian Context**:
   - Use Nigerian Naira (₦) for all monetary values
   - Respect local date formats
   - Be familiar with Edo State geography
   - Support local phone number formats

7. **Error Handling**: Implement proper error handling for edge cases.

8. **Documentation Updates**: Update relevant documentation when making significant changes.

## Troubleshooting

> **Note**: Document common issues and solutions as they are discovered.

## Contributing

_To be documented based on project requirements._

---

**Last Updated**: January 2026
**Maintained By**: AI Assistant (Claude)

> This document should be updated as the project evolves. When adding new features, dependencies, or changing workflows, please update the relevant sections.
