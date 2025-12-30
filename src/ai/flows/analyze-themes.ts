'use server';

/**
 * @fileOverview Analyzes themes in a story.
 *
 * - analyzeThemes - Identifies and explains the main themes.
 * - AnalyzeThemesInput - Input type.
 * - AnalyzeThemesOutput - Output type.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeThemesInputSchema = z.object({
  content: z.string().describe('The story content to analyze.'),
});
export type AnalyzeThemesInput = z.infer<typeof AnalyzeThemesInputSchema>;

const AnalyzeThemesOutputSchema = z.object({
  themes: z.array(z.object({
    theme: z.string().describe('The identified theme (e.g., "Love vs. Duty").'),
    analysis: z.string().describe('An explanation of how this theme is developed in the text.'),
  })).describe('A list of the major themes present in the story.'),
});
export type AnalyzeThemesOutput = z.infer<typeof AnalyzeThemesOutputSchema>;

export async function analyzeThemes(input: AnalyzeThemesInput): Promise<AnalyzeThemesOutput> {
  return analyzeThemesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeThemesPrompt',
  input: {schema: AnalyzeThemesInputSchema},
  output: {schema: AnalyzeThemesOutputSchema},
  prompt: `You are a literary analyst. Read the following text and identify the major themes being explored. For each theme, provide a brief analysis of how it is developed through plot, character, or symbolism in the text.

  Content:
  {{{content}}}`,
});

const analyzeThemesFlow = ai.defineFlow(
  {
    name: 'analyzeThemesFlow',
    inputSchema: AnalyzeThemesInputSchema,
    outputSchema: AnalyzeThemesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);