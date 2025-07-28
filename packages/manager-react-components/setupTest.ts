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
  callback();
  return {
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  };
});

vi.stubGlobal('ResizeObserver', ResizeObserverMock);
