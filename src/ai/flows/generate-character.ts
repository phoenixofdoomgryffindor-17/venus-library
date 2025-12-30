'use server';

/**
 * @fileOverview An AI agent that generates a character profile.
 *
 * - generateCharacter - A function that generates a character profile.
 * - GenerateCharacterInput - The input type for the generateCharacter function.
 * - GenerateCharacterOutput - The return type for the generateCharacter function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCharacterInputSchema = z.object({
  prompt: z.string().describe('A brief description of the character to generate.'),
});
export type GenerateCharacterInput = z.infer<typeof GenerateCharacterInputSchema>;

const GenerateCharacterOutputSchema = z.object({
  name: z.string().describe("The character's full name."),
  description: z.string().describe("A detailed physical and personality description of the character."),
  backstory: z.string().describe("The character's backstory and motivations."),
});
export type GenerateCharacterOutput = z.infer<typeof GenerateCharacterOutputSchema>;

export async function generateCharacter(input: GenerateCharacterInput): Promise<GenerateCharacterOutput> {
  return generateCharacterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCharacterPrompt',
  input: {schema: GenerateCharacterInputSchema},
  output: {schema: GenerateCharacterOutputSchema},
  prompt: `You are a creative character designer. Based on the following prompt, create a new character. Provide a name, a detailed description (physical and personality), and a compelling backstory.

  Prompt: {{{prompt}}}`,
});

const generateCharacterFlow = ai.defineFlow(
  {
    name: 'generateCharacterFlow',
    inputSchema: GenerateCharacterInputSchema,
    outputSchema: GenerateCharacterOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
