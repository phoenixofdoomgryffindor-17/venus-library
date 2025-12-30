
type Shortcut = {
  combo: string
  command: () => void
}

const shortcuts = new Map<string, Shortcut>();

export function registerShortcut(combo: string, command: () => void) {
  if (shortcuts.has(combo)) {
      console.warn(`Shortcut combo "${combo}" is already registered. It will be overwritten.`);
  }
  shortcuts.set(combo, { combo, command });
}

export function unregisterShortcut(combo: string) {
    shortcuts.delete(combo);
}

export function handleKeyDown(e: KeyboardEvent) {
  const key = [
    e.ctrlKey || e.metaKey ? 'Ctrl' : '',
    e.shiftKey ? 'Shift' : '',
    e.key.toUpperCase()
  ]
    .filter(Boolean)
    .join('+')

  const match = shortcuts.get(key);
  if (match) {
    e.preventDefault()
    match.command()
  }
}
