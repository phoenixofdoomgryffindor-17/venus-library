'use server';

/**
 * @fileOverview This file contains a Genkit flow for automatically flagging inappropriate content in book uploads and reviews.
 *
 * - flagInappropriateContent - A function that triggers the content flagging process.
 * - FlagInappropriateContentInput - The input type for the flagInappropriateContent function.
 * - FlagInappropriateContentOutput - The return type for the flagInappropriateContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FlagInappropriateContentInputSchema = z.object({
  text: z.string().describe('The text content to be checked for inappropriate content.'),
  contentType: z.enum(['book', 'review']).describe('The type of content being checked.'),
});

export type FlagInappropriateContentInput = z.infer<typeof FlagInappropriateContentInputSchema>;

const FlagInappropriateContentOutputSchema = z.object({
  isFlagged: z.boolean().describe('Whether the content is flagged as inappropriate.'),
  reason: z.string().optional().describe('The reason the content was flagged as inappropriate.'),
});

export type FlagInappropriateContentOutput = z.infer<typeof FlagInappropriateContentOutputSchema>;

export async function flagInappropriateContent(
  input: FlagInappropriateContentInput
): Promise<FlagInappropriateContentOutput> {
  return flagInappropriateContentFlow(input);
}

const flagInappropriateContentPrompt = ai.definePrompt({
  name: 'flagInappropriateContentPrompt',
  input: {schema: FlagInappropriateContentInputSchema},
  output: {schema: FlagInappropriateContentOutputSchema},
  prompt: `You are an AI content moderation tool. Your task is to determine whether the given text content is inappropriate based on the following criteria:\n\n- Hate speech: Content that promotes violence, incites hatred, or disparages individuals or groups based on race, ethnicity, religion, gender, sexual orientation, disability, or other protected characteristics.\n- Sexually explicit content: Content that contains nudity, sexual acts, or sexually suggestive material.\n- Harassment: Content that targets individuals with abusive, offensive, or threatening language.\n- Dangerous content: Content that promotes illegal activities, provides instructions for harmful acts, or glorifies violence.\n\nGiven the following text content and its type ({{{contentType}}}), determine whether it violates these criteria. If it does, set isFlagged to true and provide a brief reason for flagging. If it does not, set isFlagged to false.\n\nText: {{{text}}} `,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
    ],
  },
});

const flagInappropriateContentFlow = ai.defineFlow(
  {
    name: 'flagInappropriateContentFlow',
    inputSchema: FlagInappropriateContentInputSchema,
    outputSchema: FlagInappropriateContentOutputSchema,
  },
  async input => {
    const {output} = await flagInappropriateContentPrompt(input);
    return output!;
  }
);
