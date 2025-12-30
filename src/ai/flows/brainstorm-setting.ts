'use server';

/**
 * @fileOverview Brainstorms a story setting.
 *
 * - brainstormSetting - Generates a detailed setting description.
 * - BrainstormSettingInput - Input type.
 * - BrainstormSettingOutput - Output type.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BrainstormSettingInputSchema = z.object({
  prompt: z.string().describe('A brief idea for a setting (e.g., "magical forest", "cyberpunk city").'),
});
export type BrainstormSettingInput = z.infer<typeof BrainstormSettingInputSchema>;

const BrainstormSettingOutputSchema = z.object({
  settingDescription: z.string().describe('A rich, multi-paragraph description of the setting, including sensory details.'),
});
export type BrainstormSettingOutput = z.infer<typeof BrainstormSettingOutputSchema>;

export async function brainstormSetting(input: BrainstormSettingInput): Promise<BrainstormSettingOutput> {
  return brainstormSettingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'brainstormSettingPrompt',
  input: {schema: BrainstormSettingInputSchema},
  output: {schema: BrainstormSettingOutputSchema},
  prompt: `You are a world-building expert. Based on the prompt "{{prompt}}", generate a vivid and detailed description of a story setting. Include details about the sights, sounds, smells, and overall atmosphere. Make it a place that feels alive and sparks imagination.`,
});

const brainstormSettingFlow = ai.defineFlow(
  {
    name: 'brainstormSettingFlow',
    inputSchema: BrainstormSettingInputSchema,
    outputSchema: BrainstormSettingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);