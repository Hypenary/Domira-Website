

export enum UserRole {
  TENANT = 'tenant',
  LANDLORD = 'landlord',
  AGENT = 'agent'
}

export type LandlordStatus = 'none' | 'pending' | 'approved';
export type AgentStatus = 'none' | 'pending' | 'approved';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  progress?: number;
  total?: number;
}

export interface Review {
  id: string;
  author_name: string;
  author_avatar: string;
  rating: number;
  comment: string;
  date: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  role: UserRole;
  is_verified: boolean;
  is_gold?: boolean;
  gold_theme?: 'Classic' | 'Midnight' | 'Sunrise' | 'Sapphire';
  roommate_finding_active: boolean;
  questionnaire_completed: boolean;
  document_verified: boolean;
  landlord_status: LandlordStatus;
  agent_status?: AgentStatus;
  ren_number?: string;
  agency_name?: string;
  bio?: string;
  occupation?: string;
  lifestyle_tags?: string[];
  saved_listings: string[];
  badges?: Badge[];
  rating?: number;
  reviews?: Review[];
}

export interface Property {
  id: string;
  landlord_id: string;
  title: string;
  address: string;
  price: number;
  lat: number;
  lng: number;
  amenities: string[];
  images: string[];
  is_verified: boolean;
  verification_status?: 'not_requested' | 'pending' | 'verified';
  category: 'Entire Unit' | 'Master Room' | 'Single Room';
  beds: number;
  total_rooms?: number;
  baths: number;
  sqft: number;
  description?: string;
  halal_kitchen: boolean;
  pets_allowed: boolean;
  car_park: boolean;
  laundry: boolean;
  cooking_allowed: boolean;
  gender_preference: 'Any' | 'Male' | 'Female';
  furnished_status: 'Fully' | 'Partially' | 'Unfurnished';
  floor_level: 'High' | 'Mid' | 'Low';
  has_balcony: boolean;
  agent?: {
    name: string;
    image: string;
  };
}

// Fix: Added MaintenanceTicket interface for house and landlord dashboards
export interface MaintenanceTicket {
  id: string;
  property_id: string;
  title: string;
  description: string;
  category: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CANCELLED';
  reported_at: string;
  reported_by: string;
}

// Fix: Added PropertyApplication interface for landlord tracking
export interface PropertyApplication {
  id: string;
  property_id: string;
  tenant_id: string;
  tenant_name: string;
  tenant_avatar: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  created_at: string;
  message?: string;
}

export interface MapInsight {
  id: string;
  author_name: string;
  author_avatar: string;
  category: 'safety' | 'flood' | 'food' | 'ums';
  lat: number;
  lng: number;
  rating: number;
  comment: string;
  area_name: string;
}

export interface Gig {
  id: string;
  landlord_id: string;
  landlord_name: string;
  landlord_avatar: string;
  landlord_rating: number;
  title: string;
  description: string;
  location: string;
  distance_from_ums: string;
  pay_amount: number;
  duration: number;
  category: 'Cleaning' | 'Minor Repair' | 'Moving' | 'Other';
  is_public: boolean;
  status: 'POSTED' | 'APPLICATIONS' | 'HIRED' | 'COMPLETED';
  created_at: string;
  skills_required?: string[];
}

export interface GigApplication {
  id: string;
  gig_id: string;
  student_id: string;
  student_name: string;
  student_avatar: string;
  message: string;
  availability: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
}

export interface RoommateProfile {
  id: string;
  user: UserProfile;
  budget_min: number;
  budget_max: number;
  preferred_locations: string[];
  lifestyle_tags: string[];
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  match_percentage: number;
}

export interface Inquiry {
  id: string;
  property_id: string;
  property_title?: string;
  tenant_id: string;
  tenant_name: string;
  tenant_avatar: string;
  type: 'CHAT' | 'VIEWING' | 'RESERVED';
  status: 'PENDING' | 'CONFIRMED';
  date: string;
  amount?: number;
  message: string;
}

export interface Bill {
  id: string;
  title: string;
  total_amount: number;
  due_date: string;
  status: 'PENDING' | 'LATE' | 'PAID';
  category: string;
}

export interface HouseVote {
  id: string;
  question: string;
  options: { label: string; votes: number }[];
  status: 'ACTIVE' | 'CLOSED';
  created_at: string;
}

export interface HouseMessage {
  id: string;
  sender_id: string;
  sender_name: string;
  sender_avatar: string;
  text: string;
  timestamp: string;
}

export const MALAYSIAN_LOCATIONS = [
  "Kuala Lumpur", "Petaling Jaya", "Subang Jaya", "Shah Alam", "Cyberjaya", "Putrajaya", "Penang", "Johor Bahru", "Ipoh", "Melaka", "Kota Kinabalu", "Kuching", "Sepanggar", "Inanam", "Luyang", "Alamesra"
];

export const LIFESTYLE_TAGS = [
  'Early Riser', 'Night Owl', 'Non-Smoker', 'Halal', 'Clean', 'Student', 'Gamer', 'Working Pro', 'Pet-Friendly', 'Cooks Often', 'Social', 'Introvert'
];