
export type UserRole = 'entrepreneur' | 'hub_manager' | 'buyer' | 'csr' | 'admin';

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  phone?: string;
  location?: string;
  preferredLanguage: string;
  createdAt: string;
}

export interface EntrepreneurProfile extends UserProfile {
  role: 'entrepreneur';
  aadharNumber: string;
  occupation: string;
  familyIncome: number;
  products?: Product[];
  hubManagerPermission: boolean;
  assistingHubManagerId?: string;
}

export interface HubManagerProfile extends UserProfile {
  role: 'hub_manager';
  hubId: string;
  hubName: string;
  location: string;
  managedEntrepreneurs: string[]; // IDs of entrepreneurs under management
}

export interface BuyerProfile extends UserProfile {
  role: 'buyer';
  companyName?: string;
  businessType?: string;
}

export interface CSRProfile extends UserProfile {
  role: 'csr';
  organizationName: string;
  registrationNumber: string;
  supportedInitiatives: string[];
}

export interface Product {
  id: string;
  owner_id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  location: string;
  created_at: string;
  updated_at: string;
  status: 'active' | 'draft' | 'sold';
  owner?: { name: string };
}

export interface GovScheme {
  id: string;
  title: string;
  description: string;
  eligibility_criteria: {
    minIncome?: number;
    maxIncome?: number;
    eligibleOccupations?: string[];
    eligibleLocations?: string[];
    eligibleCategories?: string[];
    minAge?: number;
    maxAge?: number;
  };
  benefits: string[];
  application_url: string;
  created_at: string;
}

// Helper types for database schema matching
export interface DatabaseScheme {
  id: string;
  title: string;
  description: string;
  eligibility_criteria: Json;
  benefits: string[];
  application_url: string;
  created_at: string;
}
