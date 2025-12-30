'use server';

/**
 * @fileOverview A flow to recommend trending books based on user reading history and preferences.
 *
 * - recommendTrendingBooks - A function that recommends trending books.
 * - RecommendTrendingBooksInput - The input type for the recommendTrendingBooks function.
 * - RecommendTrendingBooksOutput - The return type for the recommendTrendingBooks function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendTrendingBooksInputSchema = z.object({
  userReadingHistory: z
    .array(z.string())
    .describe('An array of book IDs representing the user reading history.'),
  userPreferences: z
    .string()
    .describe('A string describing the user preferences for books.'),
});
export type RecommendTrendingBooksInput = z.infer<
  typeof RecommendTrendingBooksInputSchema
>;

const RecommendTrendingBooksOutputSchema = z.object({
  recommendedBookIds: z
    .array(z.string())
    .describe(
      'An array of book IDs representing the recommended trending books.'
    ),
});
export type RecommendTrendingBooksOutput = z.infer<
  typeof RecommendTrendingBooksOutputSchema
>;

export async function recommendTrendingBooks(
  input: RecommendTrendingBooksInput
): Promise<RecommendTrendingBooksOutput> {
  return recommendTrendingBooksFlow(input);
}

const recommendTrendingBooksPrompt = ai.definePrompt({
  name: 'recommendTrendingBooksPrompt',
  input: {schema: RecommendTrendingBooksInputSchema},
  output: {schema: RecommendTrendingBooksOutputSchema},
  prompt: `You are an expert book recommender. Given a user's reading history and preferences, you will recommend trending books that the user might enjoy.

User Reading History: {{{userReadingHistory}}}
User Preferences: {{{userPreferences}}}

Recommend trending book IDs in an array.`,
});

const recommendTrendingBooksFlow = ai.defineFlow(
  {
    name: 'recommendTrendingBooksFlow',
    inputSchema: RecommendTrendingBooksInputSchema,
    outputSchema: RecommendTrendingBooksOutputSchema,
  },
  async input => {
    const {output} = await recommendTrendingBooksPrompt(input);
    return output!;
  }
);
