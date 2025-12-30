'use server';

/**
 * @fileOverview An AI agent that suggests plot points for a story chapter.
 *
 * - suggestPlotPoints - A function that suggests plot points based on the current chapter.
 * - SuggestPlotPointsInput - The input type for the suggestPlotPoints function.
 * - SuggestPlotPointsOutput - The return type for the suggestPlotPoints function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestPlotPointsInputSchema = z.object({
  chapterContent: z
    .string()
    .describe('The content of the current chapter of the story.'),
});
export type SuggestPlotPointsInput = z.infer<typeof SuggestPlotPointsInputSchema>;

const SuggestPlotPointsOutputSchema = z.object({
  plotPointSuggestions: z
    .array(z.string())
    .describe('A list of suggested plot points for the next chapter.'),
});
export type SuggestPlotPointsOutput = z.infer<typeof SuggestPlotPointsOutputSchema>;

export async function suggestPlotPoints(input: SuggestPlotPointsInput): Promise<SuggestPlotPointsOutput> {
  return suggestPlotPointsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestPlotPointsPrompt',
  input: {schema: SuggestPlotPointsInputSchema},
  output: {schema: SuggestPlotPointsOutputSchema},
  prompt: `You are a creative writing assistant helping authors overcome writer's block.

  Based on the content of the current chapter, suggest three possible plot points for the next chapter of the story.

  Current Chapter Content:
  {{chapterContent}}`,
});

const suggestPlotPointsFlow = ai.defineFlow(
  {
    name: 'suggestPlotPointsFlow',
    inputSchema: SuggestPlotPointsInputSchema,
    outputSchema: SuggestPlotPointsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
