
export interface PostContent {
  id: string;
  niche: string;
  text: string;
  imageUrl?: string;
  timestamp: number;
  status: 'draft' | 'posted';
}

export interface SocialIntegrations {
  facebook: boolean;
  instagram: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  picture: string;
  integrations: SocialIntegrations;
}

export interface NicheConfig {
  name: string;
  tone: string;
  targetAudience: string;
}
