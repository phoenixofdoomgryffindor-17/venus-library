
import type { VenusPlugin } from '@/engine/plugins/VenusPlugin';
import { CitationPlugin } from './citation';
import { ScreenplayPlugin } from './screenplay';
import { AcademicAIPlugin } from './academic-ai';
import { ExportProPlugin } from './export-pro';

export const ALL_PLUGINS: VenusPlugin[] = [
  CitationPlugin,
  ScreenplayPlugin,
  AcademicAIPlugin,
  ExportProPlugin
];
