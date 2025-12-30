
import type { VenusPlugin } from '@/engine/plugins/VenusPlugin';

export const ExportProPlugin: VenusPlugin = {
  id: 'export.pro',
  name: 'Pro Exporter',
  version: '1.1.0',
  author: 'Venus Labs',
  description: 'Advanced export options including InDesign and LaTeX.',
  permissions: ['export.pdf', 'export.epub', 'document.publish'],

  features: [
    {
      id: 'export.indesign',
      title: 'Export to InDesign (IDML)',
      tab: 'view', // Changed from file
      action: () => console.log('Exporting to InDesign...'),
    },
    {
      id: 'export.latex',
      title: 'Export to LaTeX',
      tab: 'view', // Changed from file
      action: () => console.log('Exporting to LaTeX...'),
    }
  ],
  
  onLoad: () => {
    console.log('Pro Exporter Loaded!');
  }
};
