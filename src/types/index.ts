
export type UserRole = 'entrepreneur' | 'hub_manager' | 'buyer' | 'csr' | 'admin';

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
  products: Product[];
  hubManagerPermission: boolean;
  assistingHubManagerId?: string;
}

export interface HubManagerProfile extends UserProfile {
  role: 'hub_manager';
  hubId: string;
  hubName: string;
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
  ownerId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  location: string;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'draft' | 'sold';
}

export interface GovScheme {
  id: string;
  title: string;
  description: string;
  eligibilityCriteria: {
    minIncome?: number;
    maxIncome?: number;
    eligibleOccupations?: string[];
    eligibleLocations?: string[];
    eligibleCategories?: string[];
    minAge?: number;
    maxAge?: number;
  };
  benefits: string[];
  applicationUrl: string;
}
