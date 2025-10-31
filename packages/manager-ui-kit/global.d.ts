// global.d.ts
import * as React from 'react';

import * as ReactDOM from 'react-dom';

declare global {
  const React: typeof React;
  const ReactDOM: typeof ReactDOM;

  class EventTargetPolyfill {
    listeners: Record<string, Set<(event: Event) => void>>;
    addEventListener(type: string, listener: (event: Event) => void): void;
    removeEventListener(type: string, listener: (event: Event) => void): void;
    dispatchEvent(event: Event): boolean;
  }

  var EventTarget: typeof EventTargetPolyfill;

  interface ResizeObserverEntry {
    borderBoxSize: { inlineSize: number; blockSize: number }[];
    contentBoxSize: { inlineSize: number; blockSize: number }[];
    devicePixelContentBoxSize: { inlineSize: number; blockSize: number }[];
  }

  interface Window {
    ResizeObserver: typeof ResizeObserver;
  }

  interface Element {
    scrollLeft: number;
    scrollTop: number;
    scrollWidth: number;
    scrollHeight: number;
    getBoundingClientRect: () => DOMRect;
  }

  interface HTMLElement {
    scrollTo: (options?: ScrollToOptions | number, y?: number) => void;
    scrollIntoView: (arg?: boolean | ScrollIntoViewOptions) => void;
  }
}

export {};
