
export type Feature = {
  id: string
  title: string
  tab: 'home' | 'insert' | 'layout' | 'review' | 'ai' | 'view'
  icon?: string // Lucide icon name
  shortcut?: string
  action: () => void
  keywords?: string[]
}
