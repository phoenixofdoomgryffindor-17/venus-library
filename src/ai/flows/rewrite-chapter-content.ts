'use server';

/**
 * @fileOverview A flow to rewrite chapter content based on specified tone and style.
 *
 * - rewriteChapterContent - Rewrites the content of a chapter.
 * - RewriteChapterContentInput - The input type for the rewriteChapterContent function.
 * - RewriteChapterContentOutput - The return type for the rewriteChapterContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RewriteChapterContentInputSchema = z.object({
  content: z.string().describe('The content of the chapter to rewrite.'),
  tone: z.string().describe('The desired tone for the rewritten content (e.g., formal, informal, humorous).'),
  style: z.string().describe('The desired style for the rewritten content (e.g., descriptive, concise, narrative).'),
});
export type RewriteChapterContentInput = z.infer<typeof RewriteChapterContentInputSchema>;

const RewriteChapterContentOutputSchema = z.object({
  rewrittenContent: z.string().describe('The rewritten content of the chapter.'),
});
export type RewriteChapterContentOutput = z.infer<typeof RewriteChapterContentOutputSchema>;

export async function rewriteChapterContent(input: RewriteChapterContentInput): Promise<RewriteChapterContentOutput> {
  return rewriteChapterContentFlow(input);
}

const rewriteChapterContentPrompt = ai.definePrompt({
  name: 'rewriteChapterContentPrompt',
  input: {schema: RewriteChapterContentInputSchema},
  output: {schema: RewriteChapterContentOutputSchema},
  prompt: `Rewrite the following chapter content with a {{tone}} tone and a {{style}} style.\n\nChapter Content:\n{{{content}}}`,
});

const rewriteChapterContentFlow = ai.defineFlow(
  {
    name: 'rewriteChapterContentFlow',
    inputSchema: RewriteChapterContentInputSchema,
    outputSchema: RewriteChapterContentOutputSchema,
  },
  async input => {
    const {output} = await rewriteChapterContentPrompt(input);
    return output!;
  }
);
