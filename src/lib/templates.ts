// Fall back to an inline minimal dataset when generated JSON is unavailable
let templatesData: any[];
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  templatesData = require('@/data/templates.generated.json');
} catch {
  templatesData = [
    {
      id: 'portrait-dramatic-1',
      name: 'Dramatic Portrait',
      description: 'Cinematic dramatic portrait',
      category: 'portrait',
      style: 'dramatic',
      prompt: 'dramatic portrait lighting',
      tags: ['portrait','dramatic'],
      tier: 'free',
      isPremium: false,
      popularity: 80,
      rating: 4.6,
      usageCount: 500,
      createdAt: new Date().toISOString(),
      previewUrl: '/showcase/dramatic-after.jpg',
      accentColor: '#ff8800'
    }
  ];
}

export type TemplateCategory = 'portrait' | 'couple' | 'professional' | 'artistic' | 'lifestyle';
export type TemplateStyle = 'dramatic' | 'natural' | 'cinematic' | 'linkedin' | 'executive' | 'editorial' | 'modern';
export type TemplateTier = 'free' | 'premium';

export interface Template {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  style: TemplateStyle;
  prompt: string;
  tags: string[];
  tier: TemplateTier;
  isPremium: boolean;
  popularity: number;
  rating: number;
  usageCount: number;
  createdAt: string;
  previewUrl: string;
  accentColor?: string;
}

type RawTemplate = typeof templatesData[number];

function normalizeTemplate(raw: RawTemplate): Template {
  const tier: TemplateTier = (raw.tier as TemplateTier | undefined) ?? (raw.isPremium ? 'premium' : 'free');
  const ratingSource = typeof raw.rating === 'number' ? raw.rating : 4.4;
  const popularitySource = typeof raw.popularity === 'number' ? raw.popularity : 75;
  const usageSource = typeof raw.usageCount === 'number' ? raw.usageCount : 600;

  return {
    // Map raw values while enforcing Template types
    id: String(raw.id),
    name: String(raw.name),
    description: String(raw.description ?? ''),
    category: raw.category as TemplateCategory,
    style: raw.style as TemplateStyle,
    prompt: String(raw.prompt ?? ''),
    tags: Array.isArray(raw.tags) ? raw.tags.map(String) : [],
    tier,
    isPremium: Boolean(raw.isPremium ?? tier === 'premium'),
    rating: Number(Math.min(4.95, Math.max(0, ratingSource)).toFixed(2)),
    popularity: Math.min(100, Math.max(0, Math.round(popularitySource))),
    usageCount: Math.max(0, Math.round(usageSource)),
    createdAt: typeof raw.createdAt === 'string' ? raw.createdAt : new Date().toISOString(),
    previewUrl: typeof raw.previewUrl === 'string' && raw.previewUrl.length > 0 ? raw.previewUrl : '/showcase/dramatic-after.jpg',
    accentColor: typeof raw.accentColor === 'string' ? raw.accentColor : undefined
  };
}

const normalizedTemplates: Template[] = (templatesData as RawTemplate[]).map(normalizeTemplate);

export const promptTemplates: Template[] = normalizedTemplates;
export const totalTemplateCount = promptTemplates.length;

const templateById = new Map(promptTemplates.map((template) => [template.id, template]));

export function getTemplatesByCategory(category: TemplateCategory): Template[] {
  return promptTemplates.filter((template) => template.category === category);
}

export function getTemplatesByStyle(style: TemplateStyle): Template[] {
  return promptTemplates.filter((template) => template.style === style);
}

export function getTemplatesByTier(tier: TemplateTier): Template[] {
  return promptTemplates.filter((template) => template.tier === tier);
}

export function getFreeTemplates(): Template[] {
  return getTemplatesByTier('free');
}

export function getPremiumTemplates(): Template[] {
  return getTemplatesByTier('premium');
}

export function getPopularTemplates(limit: number = 12): Template[] {
  return [...promptTemplates]
    .sort((a, b) => {
      if (b.popularity === a.popularity) {
        return b.rating - a.rating;
      }
      return b.popularity - a.popularity;
    })
    .slice(0, limit);
}

export function searchTemplates(query: string): Template[] {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return promptTemplates;
  }

  return promptTemplates.filter((template) => {
    return (
      template.name.toLowerCase().includes(normalizedQuery) ||
      template.description.toLowerCase().includes(normalizedQuery) ||
      template.prompt.toLowerCase().includes(normalizedQuery) ||
      template.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery))
    );
  });
}

export function getTemplateById(id: string): Template | undefined {
  return templateById.get(id);
}
