import OpenAI from 'openai';
import { config } from './config';

// Initialize OpenRouter client
const openrouter = new OpenAI({
  baseURL: config.openrouter.baseUrl,
  apiKey: config.openrouter.apiKey,
  defaultHeaders: {
    "HTTP-Referer": config.app.url,
    "X-Title": config.app.name,
  }
});

// Types for our image generation
export interface GenerateImageParams {
  prompt: string;
  imageUrl?: string; // Base image for transformation
  userId?: string;
  resolution?: '512x512' | '1024x1024';
  style?: 'dramatic' | 'natural' | 'cinematic';
  category?: 'portrait' | 'couple' | 'professional';
}

export interface GenerateImageResponse {
  success: boolean;
  imageUrl?: string;
  prompt?: string;
  error?: string;
  usage?: {
    tokens: number;
    cost: number;
  };
}

// Enhanced prompt templates based on our research
const PROMPT_TEMPLATES = {
  portrait: {
    dramatic: (basePrompt: string) => `Create a professional dramatic portrait photograph: ${basePrompt}.
    Lighting: Warm golden backlight (3200K) creating perfect hair and shoulder rim lighting with luminous halo effect.
    Cool blue-green key light (5600K) at 45 degrees illuminating the face softly with gentle shadows.
    Subtle fill light to reduce contrast.
    Composition: Dark minimalist background (black or dark gray), subject centered or following rule of thirds.
    Expression: confident and serene.
    Quality: Photorealistic, 8K, ultra high definition, fashion magazine style, cinematic depth of field, saturated but natural colors.`,

    natural: (basePrompt: string) => `Professional natural portrait during golden hour: ${basePrompt}.
    Environment: outdoor setting during golden hour (30 minutes before sunset), warm and soft natural light.
    Lighting: Side sunlight creating golden rim light on hair, discrete reflector to illuminate face, soft natural shadows.
    Composition: natural bokeh background, looking towards horizon with natural smile.
    Style: Photorealistic, warm saturated colors, natural bokeh background, lifestyle magazine editorial style.`,

    cinematic: (basePrompt: string) => `Cinematic portrait photograph: ${basePrompt}.
    Lighting: Dramatic key lighting with strong directional shadows, rim lighting to separate from background.
    Color grading: Film-like color palette with rich shadows and highlights.
    Composition: Wide aspect ratio, dramatic framing, professional cinematography style.
    Quality: Movie poster quality, ultra-detailed, professional color grading, 8K resolution.`
  },

  couple: {
    dramatic: (basePrompt: string) => `Professional cinematic couple portrait: ${basePrompt}.
    Lighting: Intense golden backlight (3200K) creating halo on both subjects, cold blue key light (5600K) at 45° illuminating faces, creating romantic drama with complementary color contrast.
    Poses: intimate embrace, dancing pose, connected gazes, forehead touching. Natural emotional connection, spontaneous gestures, palpable chemistry.
    Setting: Dark minimalist background, subtle smoke or light particles for atmosphere, elements that don't distract from the couple.
    Mood: Cinematic romance, respectful intimacy, contemporary elegance, genuine love.
    Result: Photorealistic, editorial quality, saturated but natural colors, composition celebrating the relationship.`,

    natural: (basePrompt: string) => `Natural couple portrait during golden hour: ${basePrompt}.
    Timing: 30 minutes before sunset, natural golden and soft light surrounding the couple, long romantic shadows.
    Composition: Couple walking hand in hand/embracing while contemplating horizon/laughing together, partial silhouettes with backlight, natural elements framing the scene.
    Atmosphere: Romantic and spontaneous, genuine moments of connection, authentic emotions.
    Clothing: elegant casual/boho chic/timeless classic, colors harmonizing with golden light and setting.
    Result: Photorealistic, warm saturated colors, natural bokeh, romantic movie feeling, emotional authenticity.`
  },

  professional: {
    linkedin: (basePrompt: string) => `Professional LinkedIn headshot: ${basePrompt}.
    Setup: Neutral background (soft corporate blue/light gray/white), subject centered from waist up, bust shot framing.
    Lighting: Soft uniform key light on face (softbox or window light), no harsh shadows. Fill light to eliminate under-eye shadows. Flat lighting for clean professional appearance.
    Expression: Natural confident smile, direct eye contact with camera conveying credibility, upright professional posture.
    Clothing: business formal/business casual/elegant contemporary, solid colors complementing the background.
    Result: Photorealistic, high resolution, natural colors, polished but authentic appearance, suitable for professional networks.`,

    executive: (basePrompt: string) => `Premium executive corporate photography: ${basePrompt}.
    Environment: Modern office or studio with subtle corporate elements, sophisticated lighting demonstrating professional status.
    Lighting Setup: Key light positioned to create slight drama, rim light to separate from background, controlled fill light maintaining shadow details.
    Composition: 3/4 or bust shot framing, confident pose (arms crossed/hands on hips/elegant lean), serious but approachable expression.
    Styling: Impeccable executive suit/clothing, elegant colors (neutral tones/navy blue/charcoal), discrete elegant accessories.
    Output: Ultra professional, Forbes/Executive magazine quality, subtle but natural retouching, conveying authority and competence.`
  }
} as const;

// Generate optimized prompt based on category and style
export function generateOptimizedPrompt(params: {
  baseDescription: string;
  category: keyof typeof PROMPT_TEMPLATES;
  style: string;
}): string {
  const { baseDescription, category, style } = params;

  const categoryTemplates = PROMPT_TEMPLATES[category];
  if (!categoryTemplates || !(style in categoryTemplates)) {
    return baseDescription;
  }

  const templateFunction = categoryTemplates[style as keyof typeof categoryTemplates] as unknown as (s: string) => string;
  return templateFunction ? templateFunction(baseDescription) : baseDescription;
}

// Main image generation function
export async function generateImage(params: GenerateImageParams): Promise<GenerateImageResponse> {
  try {
    // Validate API key
    if (!config.openrouter.apiKey) {
      return {
        success: false,
        error: 'OpenRouter API key not configured'
      };
    }

    // Generate optimized prompt if category and style provided
    let finalPrompt = params.prompt;
    if (params.category && params.style) {
      finalPrompt = generateOptimizedPrompt({
        baseDescription: params.prompt,
        category: params.category,
        style: params.style
      });
    }

    // Prepare the request
    const messages: any[] = [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: finalPrompt
          }
        ]
      }
    ];

    // Add base image if provided (for transformation)
    if (params.imageUrl) {
      messages[0].content.push({
        type: 'image_url',
        image_url: {
          url: params.imageUrl
        }
      });
    }

    // Call OpenRouter API with Gemini model

    const response = await openrouter.chat.completions.create({
      model: config.openrouter.model,
      messages,
      max_tokens: 1024,
      temperature: 0.7,
      // OpenAI types don't include "image" here, but OpenRouter supports it; assert to satisfy TS
      modalities: ["image", "text"] as unknown as ("text" | "audio")[]
    } as any);


    const message = response.choices[0]?.message;
    if (!message) {
      console.error('No message in API response:', response);
      return {
        success: false,
        error: 'No message generated from API'
      };
    }

    // Extract generated image URL from images field
    let imageUrl: string | undefined;
    // Some OpenRouter responses may attach images on the message via non-typed fields
    const msgAny = message as any;
    if (msgAny.images && Array.isArray(msgAny.images) && msgAny.images.length > 0) {
      imageUrl = msgAny.images[0]?.image_url?.url;
    }

    const content = message.content || '';

    // Calculate usage costs for monitoring
    const usage = {
      tokens: response.usage?.total_tokens || 0,
      cost: params.resolution === '1024x1024' ?
        config.costs.geminiHighRes :
        config.costs.geminiPerGeneration
    };

    return {
      success: true,
      imageUrl,
      prompt: finalPrompt,
      usage
    };

  } catch (error) {
    console.error('OpenRouter API error:', error);

    // 详细记录错误信息
    if (error && typeof error === 'object') {
      console.error('Error details:', JSON.stringify(error, null, 2));
    }

    // 如果是 API 错误，尝试获取更多信息
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

// Test function for API connectivity
export async function testOpenRouterConnection(): Promise<boolean> {
  try {
    const response = await openrouter.models.list();
    return response.data.length > 0;
  } catch (error) {
    console.error('OpenRouter connection test failed:', error);
    return false;
  }
}

export default openrouter;
