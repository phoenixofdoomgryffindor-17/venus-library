
import type { VenusPlugin } from '@/engine/plugins/VenusPlugin';

export const AcademicAIPlugin: VenusPlugin = {
  id: 'academic.ai',
  name: 'Academic Writing AI',
  version: '1.0.0',
  author: 'Venus Labs',
  description: 'AI tools for formal, academic writing.',
  permissions: ['ai.use', 'editor.read', 'editor.write'],

  aiPrompts: [
    {
      id: 'academic.rewrite',
      title: 'Rewrite (Academic Tone)',
      handler: async ctx => `Rewrite the following text with a formal, academic tone, ensuring all claims are supported by evidence if possible: ${ctx.selection}`
    },
    {
      id: 'academic.literature_review',
      title: 'Generate Literature Review',
      handler: async ctx => `Based on the following topic, generate a brief literature review, citing key theoretical frameworks: ${ctx.selection}`
    }
  ],
  
  onLoad: () => {
    console.log('Academic AI Plugin Loaded!');
  }
};
