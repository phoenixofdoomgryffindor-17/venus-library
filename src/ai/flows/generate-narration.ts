'use server';

/**
 * @fileOverview Generates audio narration for a chapter.
 *
 * - generateNarration - Converts text to speech.
 * - GenerateNarrationInput - Input type.
 * - GenerateNarrationOutput - Output type.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';

const GenerateNarrationInputSchema = z.object({
  text: z.string().describe('The text to be narrated.'),
});
export type GenerateNarrationInput = z.infer<typeof GenerateNarrationInputSchema>;

const GenerateNarrationOutputSchema = z.object({
  audioDataUri: z.string().describe('The narrated audio as a data URI.'),
});
export type GenerateNarrationOutput = z.infer<typeof GenerateNarrationOutputSchema>;


async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs = [] as any[];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}


export async function generateNarration(input: GenerateNarrationInput): Promise<GenerateNarrationOutput> {
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.5-flash-preview-tts',
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' },
          },
        },
      },
      prompt: input.text,
    });

    if (!media) {
      throw new Error('No audio was generated.');
    }
    
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    
    const wavBase64 = await toWav(audioBuffer);
    
    return {
      audioDataUri: 'data:audio/wav;base64,' + wavBase64,
    };
}