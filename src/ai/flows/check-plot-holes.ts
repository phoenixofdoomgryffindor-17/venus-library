'use server';

/**
 * @fileOverview Checks for plot holes in a story.
 *
 * - checkPlotHoles - Analyzes content for inconsistencies.
 * - CheckPlotHolesInput - Input type.
 * - CheckPlotHolesOutput - Output type.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CheckPlotHolesInputSchema = z.object({
  content: z.string().describe('The story content to analyze.'),
});
export type CheckPlotHolesInput = z.infer<typeof CheckPlotHolesInputSchema>;

const CheckPlotHolesOutputSchema = z.object({
  plotHoles: z.array(z.object({
    potentialHole: z.string().describe('A description of the potential plot hole or inconsistency.'),
    suggestion: z.string().describe('A suggestion on how to fix it.'),
  })).describe('A list of identified potential plot holes and suggestions.'),
});
export type CheckPlotHolesOutput = z.infer<typeof CheckPlotHolesOutputSchema>;

export async function checkPlotHoles(input: CheckPlotHolesInput): Promise<CheckPlotHolesOutput> {
  return checkPlotHolesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'checkPlotHolesPrompt',
  input: {schema: CheckPlotHolesInputSchema},
  output: {schema: CheckPlotHolesOutputSchema},
  prompt: `You are a meticulous continuity editor. Read the following story content and identify any potential plot holes, contradictions, or logical inconsistencies. For each one you find, describe the issue and provide a constructive suggestion for how to resolve it.

  Story Content:
  {{{content}}}`,
});

const checkPlotHolesFlow = ai.defineFlow(
  {
    name: 'checkPlotHolesFlow',
    inputSchema: CheckPlotHolesInputSchema,
    outputSchema: CheckPlotHolesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);