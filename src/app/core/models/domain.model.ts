export interface Domain {
  slug: string;
  name: string;
  icon: string;
  description: string;
  order: number;
}

export interface DomainIndex {
  slug: string;
  name: string;
  sections: string[];
  lastUpdated: string;
}

export interface Feature {
  id: string;
  title: string;
  summary: string;
  content: string;
  tags: string[];
}

export interface ApiEndpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  summary: string;
  description: string;
  parameters?: ApiParameter[];
  requestBody?: string;
  responseBody?: string;
  tags: string[];
}

export interface ApiParameter {
  name: string;
  in: 'query' | 'path' | 'header' | 'body';
  type: string;
  required: boolean;
  description: string;
}

export interface QaItem {
  id: string;
  question: string;
  answer: string;
  tags: string[];
}

export interface SearchableItem {
  type: 'feature' | 'api' | 'qa';
  domainSlug: string;
  domainName: string;
  id: string;
  title: string;
  summary: string;
  content: string;
  tags: string[];
  routerLink: string;
}
