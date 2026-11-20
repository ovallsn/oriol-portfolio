import rawPortfolio from './portfolio.json';

export type Locale = 'en' | 'es';
export type SkillGroupId = 'support' | 'systems' | 'applications' | 'operations';

export interface LocalizedText {
  en: string;
  es: string;
}

export interface PortfolioCopy {
  hero: {
    headline: string;
    summary: string;
    availability: string;
    supportCaseLink: string;
  };
  about: {
    title: string;
    body: string;
    secondBody: string;
  };
  approach: {
    title: string;
    steps: Array<{ title: string; body: string }>;
  };
  skills: {
    title: string;
    allLabel: string;
    defaultExample: string;
    filterLabel: string;
  };
  experience: {
    title: string;
    intro: string;
  };
  work: {
    title: string;
    intro: string;
    privateLabel: string;
    businessLabel: string;
    productLabel: string;
    visitLabel: string;
    repositoryLabel: string;
  };
  contact: {
    title: string;
    intro: string;
    emailLabel: string;
    linkedinLabel: string;
    githubLabel: string;
    businessLabel: string;
  };
}

export interface SkillGroup {
  id: SkillGroupId;
  label: LocalizedText;
  example: LocalizedText;
  skills: Record<Locale, string[]>;
}

export interface ExperienceEntry {
  id: string;
  company: string;
  title: LocalizedText;
  dates: LocalizedText;
  description: LocalizedText;
  note?: LocalizedText;
  kind?: 'business';
}

export interface ProjectEntry {
  id: string;
  kind: 'case' | 'business' | 'product' | 'additional';
  title: LocalizedText;
  summary: LocalizedText;
  contribution?: LocalizedText;
  tools: string[];
  destinationUrl?: string;
  confidentialityNote?: LocalizedText;
  investigationSteps?: Array<{ title: LocalizedText; detail: LocalizedText }>;
  proof?: {
    value: string;
  } & LocalizedText;
}

export interface ContactLinks {
  email: string;
  linkedin: string;
  github: string;
  business: string;
}

export interface PortfolioData {
  copy: Record<Locale, PortfolioCopy>;
  cvLinks: {
    support: Record<Locale, string>;
    application: Record<Locale, string>;
  };
  skillGroups: SkillGroup[];
  experience: ExperienceEntry[];
  projects: ProjectEntry[];
  contact: ContactLinks;
}

export const portfolio = rawPortfolio as PortfolioData;
