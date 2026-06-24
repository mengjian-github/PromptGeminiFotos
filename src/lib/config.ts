export const config = {
  app: {
    url: 'https://promptgeminifotos.com',
    name: 'Prompt Gemini Fotos',
    description: 'Transform ordinary photos into professional portraits with AI',
  },
} as const;

export type Config = typeof config;
