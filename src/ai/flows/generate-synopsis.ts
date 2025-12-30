'use server';

/**
 * @fileOverview A flow to generate a synopsis for a chapter.
 *
 * - generateSynopsis - Creates a summary of the chapter content.
 * - GenerateSynopsisInput - The input type for the generateSynopsis function.
 * - GenerateSynopsisOutput - The return type for the generateSynopsis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSynopsisInputSchema = z.object({
  content: z.string().describe('The content of the chapter to summarize.'),
});
export type GenerateSynopsisInput = z.infer<typeof GenerateSynopsisInputSchema>;

const GenerateSynopsisOutputSchema = z.object({
  synopsis: z.string().describe('A one-paragraph synopsis of the chapter.'),
});
export type GenerateSynopsisOutput = z.infer<typeof GenerateSynopsisOutputSchema>;

export async function generateSynopsis(input: GenerateSynopsisInput): Promise<GenerateSynopsisOutput> {
  return generateSynopsisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSynopsisPrompt',
  input: {schema: GenerateSynopsisInputSchema},
  output: {schema: GenerateSynopsisOutputSchema},
  prompt: `You are a skilled editor. Read the following chapter content and write a concise, one-paragraph synopsis.

  Chapter Content:
  {{{content}}}`,
});

const generateSynopsisFlow = ai.defineFlow(
  {
    name: 'generateSynopsisFlow',
    inputSchema: GenerateSynopsisInputSchema,
    outputSchema: GenerateSynopsisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
