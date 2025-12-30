'use server';

/**
 * @fileOverview A flow to suggest titles for a chapter or book.
 *
 * - suggestTitles - Brainstorms titles based on content.
 * - SuggestTitlesInput - The input type for the suggestTitles function.
 * - SuggestTitlesOutput - The return type for the suggestTitles function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTitlesInputSchema = z.object({
  content: z.string().describe('The content of the chapter or book for which to suggest titles.'),
});
export type SuggestTitlesInput = z.infer<typeof SuggestTitlesInputSchema>;

const SuggestTitlesOutputSchema = z.object({
  titles: z.array(z.string()).describe('A list of 5 suggested titles.'),
});
export type SuggestTitlesOutput = z.infer<typeof SuggestTitlesOutputSchema>;

export async function suggestTitles(input: SuggestTitlesInput): Promise<SuggestTitlesOutput> {
  return suggestTitlesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTitlesPrompt',
  input: {schema: SuggestTitlesInputSchema},
  output: {schema: SuggestTitlesOutputSchema},
  prompt: `You are an expert at marketing and titling books. Based on the following content, suggest 5 compelling and marketable titles.

  Content:
  {{{content}}}`,
});

const suggestTitlesFlow = ai.defineFlow(
  {
    name: 'suggestTitlesFlow',
    inputSchema: SuggestTitlesInputSchema,
    outputSchema: SuggestTitlesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
