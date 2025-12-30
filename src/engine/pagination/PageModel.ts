
export interface Page {
  id: string
  blocks: Block[]
}

export interface Block {
  id: string
  type: 'paragraph' | 'heading' | 'image'
  content: string
}
