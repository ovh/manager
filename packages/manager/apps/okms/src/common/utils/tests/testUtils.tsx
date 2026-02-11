import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { RenderResult } from '@testing-library/react';
import {
  Queries,
  RenderHookOptions,
  RenderHookResult,
  render,
  renderHook,
} from '@testing-library/react';
import { i18n } from 'i18next';
import { I18nextProvider } from 'react-i18next';

import { ErrorResponse } from '@/common/types/api.type';

import { initTestI18n } from './init.i18n';

/**
 * Wait for x miliseconds
 */
export const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Create a promise mock with a delay
 */
export const promiseWithDelayMock = <T,>(data: T, delay = 0): Promise<T> => {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve(data);
    }, delay),
  );
};

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Disable retries for tests
        gcTime: 0, // Disable caching for tests
      },
    },
  });

/**
 * @deprecated use testWrapperBuilder
 * Render a component with a test query client
 */
export function renderWithClient(ui: React.ReactElement): ReturnType<typeof render> & {
  rerender: (rerenderUi: React.ReactElement) => void;
} {
  const queryClient = createTestQueryClient();
  const { rerender, ...result } = render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
  return {
    ...result,
    rerender: (rerenderUi: React.ReactNode) =>
      rerender(<QueryClientProvider client={queryClient}>{rerenderUi}</QueryClientProvider>),
  };
}

/**
 * @deprecated use testWrapperBuilder
 * Create a wrapper with QueryClient for hooks
 */
export const createHookWrapper = () => {
  const queryClient = createTestQueryClient();
  const Wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
  Wrapper.displayName = 'QueryClientWrapper';
  return Wrapper;
};

/**
 * @deprecated use testWrapperBuilder
 * Renders a hook with QueryClient provider wrapper
 * @param callback - The hook function to test
 * @param options - Additional render options (excluding wrapper since we provide it)
 * @returns RenderHookResult with the hook's return value and utilities
 */
export const renderHookWithClient = <TProps, TResult>(
  callback: (props: TProps) => TResult,
  options?: Omit<RenderHookOptions<TProps>, 'wrapper'>,
): RenderHookResult<TResult, TProps> => {
  return renderHook(callback, {
    wrapper: createHookWrapper(),
    ...options,
  });
};

/**
 * @deprecated use testWrapperBuilder
 * Render a component with I18n provider
 */
let i18nValue: i18n;
export const renderWithI18n = async (
  ui: React.ReactElement,
): Promise<RenderResult<Queries, HTMLElement>> => {
  if (!i18nValue) {
    i18nValue = await initTestI18n();
  }
  const Wrappers = ({ children }: { children: React.ReactNode }) => (
    <I18nextProvider i18n={i18nValue}>{children}</I18nextProvider>
  );
  return render(ui, { wrapper: Wrappers });
};

/**
 * @deprecated use testWrapperBuilder
 * Renders a hook with i18n provider wrapper
 * @param callback - The hook function to test
 * @param options - Additional render options (excluding wrapper since we provide it)
 * @returns RenderHookResult with the hook's return value and utilities
 */
export const renderHookWithI18n = async <TProps, TResult>(
  callback: (props: TProps) => TResult,
  options?: Omit<RenderHookOptions<TProps>, 'wrapper'>,
): Promise<RenderHookResult<TResult, TProps>> => {
  if (!i18nValue) {
    i18nValue = await initTestI18n();
  }
  const Wrappers = ({ children }: { children: React.ReactNode }) => (
    <I18nextProvider i18n={i18nValue}>{children}</I18nextProvider>
  );
  return renderHook(callback, {
    wrapper: Wrappers,
    ...options,
  });
};

/**
 * Create API response mock for tests
 */
export const createErrorResponseMock = (message: string): ErrorResponse => {
  return {
    response: {
      status: 500,
      data: {
        message,
      },
    },
  };
};
