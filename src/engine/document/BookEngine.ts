
import * as Y from 'yjs';
import { paginate } from './PaginationEngine';

export class BookEngine {
  readonly ydoc: Y.Doc;
  readonly book: Y.Text;

  constructor(ydoc?: Y.Doc) {
    this.ydoc = ydoc ?? new Y.Doc();
    this.book = this.ydoc.getText('book');
  }

  replaceAll(text: string) {
    this.book.delete(0, this.book.length);
    this.book.insert(0, text);
  }

  getText(): string {
    return this.book.toString();
  }

  getPages() {
    return paginate(this.getText());
  }
}
