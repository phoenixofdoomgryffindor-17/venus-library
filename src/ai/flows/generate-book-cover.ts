'use server';

/**
 * @fileOverview Book cover generation flow using text prompts.
 *
 * - generateBookCover - A function that generates a book cover based on a text prompt.
 * - GenerateBookCoverInput - The input type for the generateBookCover function.
 * - GenerateBookCoverOutput - The return type for the generateBookCover function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBookCoverInputSchema = z.object({
  prompt: z.string().describe('A text prompt describing the desired book cover.'),
});

export type GenerateBookCoverInput = z.infer<typeof GenerateBookCoverInputSchema>;

const GenerateBookCoverOutputSchema = z.object({
  coverDataUri: z
    .string()
    .describe(
      'The generated book cover image as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' 
    ),
});

export type GenerateBookCoverOutput = z.infer<typeof GenerateBookCoverOutputSchema>;

export async function generateBookCover(input: GenerateBookCoverInput): Promise<GenerateBookCoverOutput> {
  return generateBookCoverFlow(input);
}

const generateBookCoverPrompt = ai.definePrompt({
  name: 'generateBookCoverPrompt',
  input: {schema: GenerateBookCoverInputSchema},
  output: {schema: GenerateBookCoverOutputSchema},
  prompt: `Generate a book cover image based on the following description: {{{prompt}}}. Return the image as a data URI.`,
});

const generateBookCoverFlow = ai.defineFlow(
  {
    name: 'generateBookCoverFlow',
    inputSchema: GenerateBookCoverInputSchema,
    outputSchema: GenerateBookCoverOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: input.prompt,
    });

    if (!media) {
      throw new Error('No image was generated.');
    }

    return {coverDataUri: media.url};
  }
);
