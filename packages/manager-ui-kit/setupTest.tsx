import * as React from 'react';
import { ComponentType } from 'react';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import {
  RenderOptions,
  RenderResult,
  render,
  cleanup,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import 'element-internals-polyfill';
import { vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ActionMenuTransFR from './src/components/action-menu/translations/Messages_fr_FR.json';
import DatagridTransFR from './src/components/datagrid/translations/Messages_fr_FR.json';

i18n.use(initReactI18next).init({
  fallbackLng: 'fr_FR',
  interpolation: {
    escapeValue: false,
  },
  resources: {
    fr: {
      'action-menu': {
        ...ActionMenuTransFR,
      },
      datagrid: {
        ...DatagridTransFR,
      },
    },
  },
});

export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      retry: false,
    },
    queries: {
      retry: false,
    },
  },
});

const Wrappers = ({ children }: { children: React.ReactElement }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: React.JSX.Element,
  options?: Omit<RenderOptions, 'queries'>,
): RenderResult =>
  render(ui, { wrapper: Wrappers as ComponentType, ...options });

export { customRender as render, cleanup };

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
