
import * as Y from 'yjs';

export function createSnapshot(doc: Y.Doc): Uint8Array {
  return Y.encodeStateAsUpdate(doc);
}

export function restoreSnapshot(doc: Y.Doc, update: Uint8Array) {
  Y.applyUpdate(doc, update);
}
