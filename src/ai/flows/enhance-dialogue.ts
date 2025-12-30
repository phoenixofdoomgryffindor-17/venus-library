'use server';

/**
 * @fileOverview A flow to enhance dialogue.
 *
 * - enhanceDialogue - Rewrites dialogue to be more engaging.
 * - EnhanceDialogueInput - The input type for the enhanceDialogue function.
 * - EnhanceDialogueOutput - The return type for the enhanceDialogue function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnhanceDialogueInputSchema = z.object({
  dialogue: z.string().describe('The dialogue to enhance.'),
  context: z.string().describe('The context of the scene where the dialogue takes place.'),
});
export type EnhanceDialogueInput = z.infer<typeof EnhanceDialogueInputSchema>;

const EnhanceDialogueOutputSchema = z.object({
  enhancedDialogue: z.string().describe('The rewritten, more engaging dialogue.'),
});
export type EnhanceDialogueOutput = z.infer<typeof EnhanceDialogueOutputSchema>;

export async function enhanceDialogue(input: EnhanceDialogueInput): Promise<EnhanceDialogueOutput> {
  return enhanceDialogueFlow(input);
}

const prompt = ai.definePrompt({
  name: 'enhanceDialoguePrompt',
  input: {schema: EnhanceDialogueInputSchema},
  output: {schema: EnhanceDialogueOutputSchema},
  prompt: `You are a master playwright and screenwriter. Rewrite the following dialogue to make it more impactful, natural, and revealing of character.

  Scene Context:
  {{{context}}}

  Original Dialogue:
  "{{{dialogue}}}"

  Rewrite the dialogue.`,
});

const enhanceDialogueFlow = ai.defineFlow(
  {
    name: 'enhanceDialogueFlow',
    inputSchema: EnhanceDialogueInputSchema,
    outputSchema: EnhanceDialogueOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
