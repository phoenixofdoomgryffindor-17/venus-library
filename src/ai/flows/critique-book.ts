
'use server';

/**
 * @fileOverview An AI agent that critiques a book and provides feedback.
 *
 * - critiqueBook - A function that provides a critique of a book.
 * - CritiqueBookInput - The input type for the critiqueBook function.
 * - CritiqueBookOutput - The return type for the critiqueBook function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CritiqueBookInputSchema = z.object({
  title: z.string().describe('The title of the book.'),
  content: z.string().describe('The full content of the book.'),
});
export type CritiqueBookInput = z.infer<typeof CritiqueBookInputSchema>;

const CritiqueBookOutputSchema = z.object({
  isInteresting: z.boolean().describe('Whether the book is deemed interesting or not.'),
  critique: z.string().describe("The AI's critique of the book, focusing on plot, pacing, and character development."),
  suggestions: z.string().describe('Actionable suggestions for improving the book.'),
});
export type CritiqueBookOutput = z.infer<typeof CritiqueBookOutputSchema>;

export async function critiqueBook(input: CritiqueBookInput): Promise<CritiqueBookOutput> {
  return critiqueBookFlow(input);
}

const prompt = ai.definePrompt({
  name: 'critiqueBookPrompt',
  input: {schema: CritiqueBookInputSchema},
  output: {schema: CritiqueBookOutputSchema},
  prompt: `You are an expert story doctor and development editor. Your task is to analyze the following book and provide a constructive critique.

  Book Title: {{{title}}}
  Book Content:
  {{{content}}}

  Please evaluate the book based on the following criteria:
  1.  **Plot & Pacing:** Is the story engaging? Is the pacing effective? Are there any plot holes?
  2.  **Character Development:** Are the characters compelling and well-developed? Is their journey meaningful?
  3.  **Overall Interest:** Is the book interesting? Would a reader be likely to finish it?

  Based on your analysis, determine if the book is "interesting" and set the \`isInteresting\` flag accordingly. Provide a detailed \`critique\` and offer concrete, actionable \`suggestions\` for improvement. If the book is not interesting, your suggestions should focus on how to make it more engaging.`,
});

const critiqueBookFlow = ai.defineFlow(
  {
    name: 'critiqueBookFlow',
    inputSchema: CritiqueBookInputSchema,
    outputSchema: CritiqueBookOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
