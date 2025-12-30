
import type { Page, Block } from './PageModel';

const PAGE_HEIGHT = 1056
const PAGE_PADDING = 128

export function paginate(blocks: Block[]): Page[] {
  if (!blocks || blocks.length === 0) {
    return [{ id: crypto.randomUUID(), blocks: [] }];
  }
  
  const pages: Page[] = []
  let currentPage: Page = { id: crypto.randomUUID(), blocks: [] }
  let height = 0

  for (const block of blocks) {
    const blockHeight = estimateHeight(block)

    if (height + blockHeight > PAGE_HEIGHT - PAGE_PADDING) {
      pages.push(currentPage)
      currentPage = { id: crypto.randomUUID(), blocks: [] }
      height = 0
    }

    currentPage.blocks.push(block)
    height += blockHeight
  }

  pages.push(currentPage)
  return pages
}

function estimateHeight(block: Block): number {
  if (!block || !block.content) return 24;
  return Math.max(24, Math.ceil(block.content.length / 80) * 24)
}
