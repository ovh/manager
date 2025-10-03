// vitest.setup.ts
import '@testing-library/jest-dom';
import 'element-internals-polyfill';
import { vi } from 'vitest';

// This polyfill exists because of an issue with jsdom and the EventTarget class
// when testing a component with an OdsDatepicker (addEventListener crashes at component initialization).
// Fix from issue: https://github.com/jsdom/jsdom/issues/2156
global.EventTarget = class {
  listeners = {};

  addEventListener(type, listener) {
    this.listeners = this.listeners || {};
    (this.listeners[type] || (this.listeners[type] = new Set())).add(listener);
  }

  removeEventListener(type, listener) {
    if (this.listeners && this.listeners[type]) {
      this.listeners[type].delete(listener);
    }
  }

  dispatchEvent(event) {
    this.listeners[event.type].forEach((listener) => listener(event));
    return !event.defaultPrevented;
  }
};

const ResizeObserverMock = vi.fn((callback) => {
  // Create a mock ResizeObserverEntry with the expected structure
  const mockEntry = {
    target: document.createElement('div'),
    contentRect: {
      width: 100,
      height: 100,
      top: 0,
      left: 0,
      bottom: 100,
      right: 100,
      x: 0,
      y: 0,
    },
    borderBoxSize: [{ width: 100, height: 100 }],
    contentBoxSize: [{ width: 100, height: 100 }],
    devicePixelContentBoxSize: [{ width: 100, height: 100 }],
  };

  // Call the callback with an array of entries as the real ResizeObserver does
  callback([mockEntry]);

  return {
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  };
});

vi.stubGlobal('ResizeObserver', ResizeObserverMock);
