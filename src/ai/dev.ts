'use server';

import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-plot-points.ts';
import '@/ai/flows/rewrite-chapter-content.ts';
import '@/ai/flows/generate-book-cover.ts';
import '@/ai/flows/flag-inappropriate-content.ts';
import '@/ai/flows/recommend-trending-books.ts';
import '@/ai/flows/critique-book.ts';
import '@/ai/flows/generate-character.ts';
import '@/ai/flows/enhance-dialogue.ts';
import '@/ai/flows/generate-synopsis.ts';
import '@/ai/flows/suggest-titles.ts';
import '@/ai/flows/generate-illustration.ts';
import '@/ai/flows/generate-narration.ts';
import '@/ai/flows/brainstorm-setting.ts';
import '@/ai/flows/check-plot-holes.ts';
import '@/ai/flows/analyze-themes.ts';
import '@/ai/flows/suggest-character-arc.ts';