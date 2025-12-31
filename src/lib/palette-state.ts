'use client';

// This simple event emitter manages the global state of the command palette.
// It allows any component to open the palette or subscribe to its state changes
// without creating circular dependencies.

type PaletteStateListener = (isOpen: boolean) => void;

const paletteState = {
  isOpen: false,
  listeners: new Set<PaletteStateListener>(),
  
  toggle() {
    this.isOpen = !this.isOpen;
    this.listeners.forEach(cb => cb(this.isOpen));
  },

  subscribe(callback: PaletteStateListener) {
    this.listeners.add(callback);
    // Return an unsubscribe function
    return () => this.listeners.delete(callback);
  }
};

// This is the global action to open the palette.
// It can be safely imported by any module.
export const openCommandPalette = () => paletteState.toggle();

export default paletteState;
