// src/ai-agent/interfaces/tool-inputs.interface.ts

export type PropertyType =
  | 'land'
  | 'house'
  | 'apartment'
  | 'duplex'
  | 'bungalow'
  | 'commercial'
  | 'hotel_room'
  | 'all';

export type ListingPurpose = 'sale' | 'rent' | 'shortlet' | 'all';

export type BookingStatus = 'all' | 'upcoming' | 'past' | 'cancelled';

export type IssueType =
  | 'payment'
  | 'booking'
  | 'technical'
  | 'complaint'
  | 'fraud'
  | 'other';

export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';

export interface SearchPropertiesInput {
  location: string;
  property_type?: PropertyType;
  purpose?: ListingPurpose;
  price_min?: number;
  price_max?: number;
  bedrooms_min?: number;
  bathrooms_min?: number;
  amenities?: string[];
  verified_only?: boolean;
  featured_only?: boolean;
  limit?: number;
}

export interface GetPropertyDetailsInput {
  property_id: string;
}

export interface SearchHotelsInput {
  location: string;
  check_in: string;
  check_out: string;
  guests?: number;
  price_max?: number;
}

export interface CheckAvailabilityInput {
  property_id: string;
  check_in: string;
  check_out: string;
}

export interface CalculateBookingPriceInput {
  property_id: string;
  check_in: string;
  check_out: string;
  guests?: number;
}

export interface GetUserBookingsInput {
  status?: BookingStatus;
}

export interface AddToFavoritesInput {
  property_id: string;
}

export interface CreateInquiryInput {
  property_id: string;
  message: string;
}

export interface GetNeighborhoodInfoInput {
  neighborhood: string;
}

export interface EscalateToHumanInput {
  issue_type: IssueType;
  context: string;
  urgency?: UrgencyLevel;
}

export interface ScheduleViewingInput {
  property_id: string;
  preferred_date: string;
  preferred_time?: string;
  notes?: string;
}

// Union type for all possible tool inputs
export type ToolInput =
  | SearchPropertiesInput
  | GetPropertyDetailsInput
  | SearchHotelsInput
  | CheckAvailabilityInput
  | CalculateBookingPriceInput
  | GetUserBookingsInput
  | AddToFavoritesInput
  | CreateInquiryInput
  | GetNeighborhoodInfoInput
  | EscalateToHumanInput
  | ScheduleViewingInput;
