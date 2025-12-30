'use server';

/**
 * @fileOverview Suggests a character arc.
 *
 * - suggestCharacterArc - Proposes a developmental arc for a character.
 * - SuggestCharacterArcInput - Input type.
 * - SuggestCharacterArcOutput - Output type.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestCharacterArcInputSchema = z.object({
  characterProfile: z.string().describe("A description of the character's personality and backstory."),
  storySynopsis: z.string().describe('A brief synopsis of the story.'),
});
export type SuggestCharacterArcInput = z.infer<typeof SuggestCharacterArcInputSchema>;

const SuggestCharacterArcOutputSchema = z.object({
  arcSuggestion: z.string().describe('A suggested character arc, outlining the character\'s journey from beginning to end.'),
});
export type SuggestCharacterArcOutput = z.infer<typeof SuggestCharacterArcOutputSchema>;

export async function suggestCharacterArc(input: SuggestCharacterArcInput): Promise<SuggestCharacterArcOutput> {
  return suggestCharacterArcFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestCharacterArcPrompt',
  input: {schema: SuggestCharacterArcInputSchema},
  output: {schema: SuggestCharacterArcOutputSchema},
  prompt: `You are an expert storyteller. Based on the character profile and story synopsis below, propose a compelling character arc. Describe their initial state, the inciting incident that challenges them, their journey of growth or change, and their final state at the end of the story.

  Character Profile:
  {{{characterProfile}}}

  Story Synopsis:
  {{{storySynopsis}}}`,
});

const suggestCharacterArcFlow = ai.defineFlow(
  {
    name: 'suggestCharacterArcFlow',
    inputSchema: SuggestCharacterArcInputSchema,
    outputSchema: SuggestCharacterArcOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);