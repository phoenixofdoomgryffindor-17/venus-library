'use server';

/**
 * @fileOverview Generates chapter illustrations.
 *
 * - generateIllustration - Creates an illustration based on a prompt.
 * - GenerateIllustrationInput - Input type.
 * - GenerateIllustrationOutput - Output type.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateIllustrationInputSchema = z.object({
  prompt: z.string().describe('A detailed description for the illustration.'),
});
export type GenerateIllustrationInput = z.infer<typeof GenerateIllustrationInputSchema>;

const GenerateIllustrationOutputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      'The generated illustration as a data URI.'
    ),
});
export type GenerateIllustrationOutput = z.infer<typeof GenerateIllustrationOutputSchema>;

export async function generateIllustration(input: GenerateIllustrationInput): Promise<GenerateIllustrationOutput> {
  return generateIllustrationFlow(input);
}

const generateIllustrationFlow = ai.defineFlow(
  {
    name: 'generateIllustrationFlow',
    inputSchema: GenerateIllustrationInputSchema,
    outputSchema: GenerateIllustrationOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: `A vibrant, detailed illustration for a book chapter. Style: digital painting. Scene: ${input.prompt}`,
    });

    if (!media) {
      throw new Error('No image was generated.');
    }

    return {imageDataUri: media.url};
  }
);