import '@testing-library/jest-dom';
import 'element-internals-polyfill';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { vi } from 'vitest';

import ActionMenuTransFR from './src/components/action-menu/translations/Messages_fr_FR.json';
import DatagridTransFR from './src/components/datagrid/translations/Messages_fr_FR.json';
import FiltersTransFR from './src/components/filters/translations/Messages_fr_FR.json';

void i18n.use(initReactI18next).init({
  fallbackLng: 'fr_FR',
  interpolation: { escapeValue: false },
  resources: {
    fr: {
      'action-menu': ActionMenuTransFR,
      datagrid: DatagridTransFR,
      filterAdd: FiltersTransFR,
    },
  },
});

global.EventTarget = class EventTargetPolyfill {
  private listeners: Record<string, Set<(event: Event) => void>> = {};

  addEventListener(type: string, listener: (event: Event) => void): void {
    (this.listeners[type] ||= new Set()).add(listener);
  }

  removeEventListener(type: string, listener: (event: Event) => void): void {
    this.listeners[type]?.delete(listener);
  }

  dispatchEvent(event: Event): boolean {
    const handlers = this.listeners[event.type];
    if (handlers) {
      handlers.forEach((listener) => listener(event));
    }
    return !event.defaultPrevented;
  }
};

type ResizeObserverCallback = (entries: ResizeObserverEntry[], observer: ResizeObserver) => void;

const ResizeObserverMock = vi.fn((callback: ResizeObserverCallback): ResizeObserver => {
  const mockEntry: ResizeObserverEntry = {
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
      toJSON: () => ({}),
    },
    borderBoxSize: [{ inlineSize: 100, blockSize: 100 }],
    contentBoxSize: [{ inlineSize: 100, blockSize: 100 }],
    devicePixelContentBoxSize: [{ inlineSize: 100, blockSize: 100 }],
  };

  // Call immediately, simulating a resize notification
  callback([mockEntry], {} as ResizeObserver);

  return {
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  } as unknown as ResizeObserver;
});

vi.stubGlobal('ResizeObserver', ResizeObserverMock);

Element.prototype.getBoundingClientRect = vi.fn(() => ({
  width: 1000,
  height: 600,
  top: 0,
  left: 0,
  bottom: 600,
  right: 1000,
  x: 0,
  y: 0,
  toJSON: () => {},
})) as unknown as () => DOMRect;

HTMLElement.prototype.scrollTo = vi.fn();
HTMLElement.prototype.scrollIntoView = vi.fn();

Object.defineProperty(Element.prototype, 'scrollLeft', {
  configurable: true,
  writable: true,
  value: 0,
});

Object.defineProperty(Element.prototype, 'scrollTop', {
  configurable: true,
  writable: true,
  value: 0,
});

Object.defineProperty(Element.prototype, 'scrollWidth', {
  configurable: true,
  value: 0,
});

Object.defineProperty(Element.prototype, 'scrollHeight', {
  configurable: true,
  value: 0,
});

const originalConsoleError = console.error.bind(console);

console.error = (...args: unknown[]): void => {
  const errorMessage = args[0]?.toString?.() ?? '';
  if (
    errorMessage.includes("reading 'left'") ||
    errorMessage.includes('[@zag-js/dismissable]') ||
    errorMessage.includes('preventScroll') ||
    errorMessage.includes('Uncaught Exception')
  ) {
    return; // suppress noisy jsdom/Zag async cleanup errors
  }
  originalConsoleError(...args);
};

if (typeof window !== 'undefined') {
  window.addEventListener('error', (event: ErrorEvent) => {
    const errorMessage = event.message || event.error?.message || '';
    if (errorMessage.includes("reading 'left'") || errorMessage.includes('[@zag-js/dismissable]')) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
    return true;
  });

  window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
    const errorMessage = event.reason?.message || '';
    if (errorMessage.includes("reading 'left'") || errorMessage.includes('[@zag-js/dismissable]')) {
      event.preventDefault();
      event.stopPropagation();
    }
  });
}
