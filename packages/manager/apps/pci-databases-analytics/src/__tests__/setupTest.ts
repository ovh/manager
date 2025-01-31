import { vi } from 'vitest';
import '@testing-library/jest-dom';
import { PointerEvent } from './helpers/pointerEvent';

// use a custom pointerEvent as jest does not implement it.
// it is requiered for DropdownMenus
// source: https://github.com/radix-ui/primitives/issues/856#issuecomment-928704064
window.PointerEvent = PointerEvent as any;

const originalConsoleError = console.error;

console.error = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('connect ECONNREFUSED')) {
    return;
  }
  originalConsoleError(...args);
};

const scrollMock = vi.fn();
window.HTMLElement.prototype.scrollIntoView = scrollMock;
