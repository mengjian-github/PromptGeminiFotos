export const config = {
  app: {
    url: 'https://promptgeminifotos.com',
    name: 'Prompt Gemini Fotos',
    description: 'Copy-ready Gemini photo prompts for professional portraits',
  },
} as const;

export type Config = typeof config;
