
import * as Y from 'yjs';

export class PageEngine {
  constructor(private ydoc: Y.Doc) {}

  getPage(id: string): Y.Text {
    return this.ydoc.getText(`page:${id}`);
  }

  createPage(id: string) {
    const page = this.getPage(id);
    if (page.length === 0) page.insert(0, '');
    return page;
  }
}
