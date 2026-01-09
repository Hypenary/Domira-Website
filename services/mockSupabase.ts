
import { Property, RoommateProfile, UserProfile, UserRole, Inquiry, PropertyApplication, MaintenanceTicket, Gig, GigApplication, Badge, Review } from '../types';

const MOCK_REVIEWS: Review[] = [
  { id: 'r1', author_name: 'Aiman Hakimi', author_avatar: 'https://picsum.photos/seed/aiman/100/100', rating: 5, comment: 'Excellent tenant, very clean and always pays on time.', date: 'Oct 12, 2024' },
  { id: 'r2', author_name: 'Sarah Lim', author_avatar: 'https://picsum.photos/seed/sarah/100/100', rating: 4, comment: 'Respectful and quiet housemate. Highly recommended.', date: 'Sep 28, 2024' }
];

const MOCK_BADGES: Badge[] = [
  { id: 'b1', name: 'Verified Student', description: 'Student status verified by Domira audit.', icon: 'ShieldCheck', earned: true },
  { id: 'b2', name: 'Super Cleaner', description: 'Completed 5+ cleaning gigs with 5-star ratings.', icon: 'Sparkles', earned: true, progress: 5, total: 5 },
  { id: 'b3', name: 'Reliable Tenant', description: '12 months of on-time rental payments.', icon: 'Star', earned: true },
  { id: 'b4', name: 'Quick Responder', description: 'Replies to messages in under 10 minutes.', icon: 'Zap', earned: false, progress: 7, total: 10 },
  { id: 'b5', name: 'Community Helper', description: 'Referred 3 friends to the platform.', icon: 'Users', earned: false, progress: 1, total: 3 },
];

const MOCK_INQUIRIES: Inquiry[] = [
  {
    id: 'inq_1',
    property_id: 'prop_1',
    tenant_id: 'tenant_1',
    tenant_name: 'Nurul Aisyah',
    tenant_avatar: 'https://picsum.photos/seed/tenant1/100/100',
    type: 'CHAT',
    status: 'PENDING',
    date: 'Oct 28, 2024',
    message: 'Is the parking spot covered? Also wondering about the WiFi speed.'
  },
  {
    id: 'inq_2',
    property_id: 'prop_2',
    tenant_id: 'tenant_2',
    tenant_name: 'Kevin Tan',
    tenant_avatar: 'https://picsum.photos/seed/tenant2/100/100',
    type: 'VIEWING',
    status: 'PENDING',
    date: 'Oct 29, 2024',
    message: 'I would like to view the master room this Saturday morning if possible.'
  }
];

let properties_db: Property[] = [
  {
    id: 'prop_1', landlord_id: 'landlord_1', title: 'Modern Loft @ Alamesra', address: '1 Borneo Tower, Kota Kinabalu', price: 1200, lat: 6.0354, lng: 116.1424,
    amenities: ['Wifi', 'Aircon', 'Gym', 'Pool'], images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
    is_verified: true, category: 'Entire Unit', beds: 2, baths: 1, sqft: 850, halal_kitchen: true, pets_allowed: false, gender_preference: 'Any', car_park: true, laundry: true, cooking_allowed: true, verification_status: 'verified',
    furnished_status: 'Fully', floor_level: 'High', has_balcony: true, agent: { name: 'John Agent', image: 'https://picsum.photos/seed/agent/100/100' }
  },
  {
    id: 'prop_2', landlord_id: 'landlord_2', title: 'Executive Master Room @ Jesselton Quay', address: 'Jesselton Quay, Kota Kinabalu', price: 950, lat: 5.9904, lng: 116.0824,
    amenities: ['Seaview', 'Wifi', 'Infinity Pool'], images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
    is_verified: true, category: 'Master Room', beds: 1, baths: 1, sqft: 400, halal_kitchen: true, pets_allowed: false, gender_preference: 'Female', car_park: true, laundry: true, cooking_allowed: true, verification_status: 'verified',
    furnished_status: 'Fully', floor_level: 'High', has_balcony: true, agent: { name: 'Sarah Pro', image: 'https://picsum.photos/seed/agent2/100/100' }
  }
];

let gigs_db: Gig[] = [
  {
    id: 'gig_1', landlord_id: 'landlord_1', landlord_name: 'Sarah Lim', landlord_avatar: 'https://picsum.photos/seed/sarah/100/100', landlord_rating: 4.8,
    title: 'AC Filter Cleaning @ Alamesra', description: 'Need someone to clean filters for 3 AC units. Brushes provided.', location: 'Alamesra, KK', distance_from_ums: '0.5 km', pay_amount: 30, duration: 1, category: 'Cleaning', is_public: true, status: 'POSTED', created_at: 'Oct 28, 2024'
  }
];

const UNIQUE_NAMES = [
  'Nurul Aisyah', 'Kevin Tan', 'Mohd Farhan', 'Chong Wei', 'Siti Aminah', 'Jessica Wong', 'Raj Kumar', 'Ariff Adnan'
];

const MOCK_ROOMMATES: RoommateProfile[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `tenant_${i + 1}`,
  user: {
    id: `tenant_${i + 1}`,
    email: `student${i + 1}@ums.edu.my`,
    full_name: UNIQUE_NAMES[i % UNIQUE_NAMES.length],
    avatar_url: `https://picsum.photos/seed/tenant${i + 1}/200/200`,
    role: UserRole.TENANT,
    is_verified: i % 2 === 0,
    roommate_finding_active: true,
    questionnaire_completed: true,
    document_verified: i % 2 === 0,
    landlord_status: 'none',
    agent_status: 'none',
    occupation: i % 3 === 0 ? 'Medical Student, UMS' : 'Engineering Student, UMS',
    bio: 'Looking for a clean and respectful roommate near Sepanggar area. I study a lot but enjoy occasional weekend hikes.',
    saved_listings: [],
    badges: i % 3 === 0 ? MOCK_BADGES.slice(0, 2) : [],
    rating: 4.0 + (i % 11) / 10,
    reviews: MOCK_REVIEWS,
    is_gold: i === 0,
    gold_theme: 'Midnight'
  },
  age: 19 + (i % 5),
  gender: i % 2 === 0 ? 'Female' : 'Male',
  budget_min: 300,
  budget_max: 600 + (i * 20),
  preferred_locations: ['Sepanggar', 'Alamesra'],
  lifestyle_tags: ['Clean', 'Student', i % 2 === 0 ? 'Halal' : 'Gamer'],
  match_percentage: 80 + (i % 20)
}));

export const api = {
  properties: {
    list: async (): Promise<Property[]> => {
      await new Promise(r => setTimeout(r, 400));
      return properties_db;
    },
    listByLandlord: async (id: string): Promise<Property[]> => {
      await new Promise(r => setTimeout(r, 400));
      return properties_db.filter(p => p.landlord_id === id || id === 'current_user');
    },
    getById: async (id: string): Promise<Property | undefined> => {
      await new Promise(r => setTimeout(r, 200));
      return properties_db.find(p => p.id === id);
    },
    create: async (data: Partial<Property>): Promise<Property> => {
      await new Promise(r => setTimeout(r, 800));
      const newProp = { ...data, id: `prop_${Date.now()}`, landlord_id: 'current_user', is_verified: false, verification_status: 'not_requested' } as Property;
      properties_db = [newProp, ...properties_db];
      return newProp;
    },
    update: async (id: string, data: Partial<Property>): Promise<Property> => {
      const idx = properties_db.findIndex(p => p.id === id);
      properties_db[idx] = { ...properties_db[idx], ...data };
      return properties_db[idx];
    },
    requestVerification: async (id: string) => {
       const idx = properties_db.findIndex(p => p.id === id);
       properties_db[idx].verification_status = 'pending';
    }
  },
  gigs: {
    list: async (): Promise<Gig[]> => { await new Promise(r => setTimeout(r, 500)); return gigs_db; },
    create: async (d: any) => {
      const g = { ...d, id: `gig_${Date.now()}`, landlord_id: 'current_user' } as Gig;
      gigs_db = [g, ...gigs_db];
      return g;
    },
    apply: async (id: string, app: any) => { await new Promise(r => setTimeout(r, 800)); },
    markCompleted: async (id: string) => {}
  },
  landlord: {
    getDashboard: async (id: string) => {
      await new Promise(r => setTimeout(r, 600));
      return {
        stats: { totalViews: 450, activeInquiries: MOCK_INQUIRIES.length, pendingViewings: 2, totalReserved: 1 },
        inquiries: MOCK_INQUIRIES,
        applications: [],
        maintenance: []
      };
    }
  },
  agent: {
    apply: async (id: string, data: any) => {
      await new Promise(r => setTimeout(r, 1500));
      return { success: true };
    }
  },
  roommates: {
    list: async (): Promise<RoommateProfile[]> => {
      await new Promise(r => setTimeout(r, 500));
      return MOCK_ROOMMATES;
    },
    getById: async (id: string): Promise<RoommateProfile | undefined> => {
      return MOCK_ROOMMATES.find(r => r.id === id);
    }
  },
  auth: {
    login: async (email: string, role: UserRole): Promise<UserProfile> => {
      await new Promise(r => setTimeout(r, 600));
      return {
        id: 'current_user', email, full_name: 'Demo User', avatar_url: 'https://picsum.photos/seed/user/200/200',
        role, is_verified: false, roommate_finding_active: true, questionnaire_completed: false, document_verified: false,
        landlord_status: role === UserRole.LANDLORD ? 'pending' : 'none', agent_status: role === UserRole.AGENT ? 'pending' : 'none', 
        occupation: role === UserRole.TENANT ? 'Student' : role === UserRole.AGENT ? 'Property Consultant' : 'Owner', 
        lifestyle_tags: [], saved_listings: [],
        badges: MOCK_BADGES.map(b => ({ ...b, earned: false })), rating: 4.8, reviews: [], is_gold: false, gold_theme: 'Classic'
      };
    },
    resetPassword: async (e: string) => true
  }
};
