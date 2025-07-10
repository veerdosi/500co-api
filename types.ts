export interface FiveHundredCompany {
  id: number;
  name: string;
  slug: string;
  website: string;
  description: string;
  one_liner: string;
  location: string;
  industry: string;
  subindustry: string;
  status: 'Active' | 'Acquired' | 'IPO' | 'Closed';
  founded_year?: number;
  logo_url?: string;
  is_billion_plus: boolean;
  is_in_program: boolean;
  is_bcorp: boolean;
  tags: string[];
  url: string;
  api: string;
}
