
export const PAGE_CHAR_LIMIT = 1800;

export function paginate(text: string): string[] {
  const pages: string[] = [];
  let buffer = '';

  for (const char of text) {
    buffer += char;
    if (buffer.length >= PAGE_CHAR_LIMIT) {
      pages.push(buffer);
      buffer = '';
    }
  }

  if (buffer.length > 0) pages.push(buffer);
  return pages;
}
