import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Handler } from '@ovh-ux/manager-core-test-utils';
import {
  render,
  renderHook,
  RenderHookOptions,
  RenderHookResult,
} from '@testing-library/react';
import { ErrorResponse } from '@/types/api.type';

/**
 * Set all handlers to 0ms delay
 * This avoids the global utils function to set a default delay of 1000ms
 */
export const removeHandlersDelay = (handlers: Handler[]): Handler[] => {
  return handlers.map((handler) => {
    return { ...handler, delay: 0 };
  });
};

/**
 * Wait for x miliseconds
 */
export const wait = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

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
 * Render a component with a test query client
 */
export function renderWithClient(
  ui: React.ReactElement,
): ReturnType<typeof render> & {
  rerender: (rerenderUi: React.ReactElement) => void;
} {
  const queryClient = createTestQueryClient();
  const { rerender, ...result } = render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
  return {
    ...result,
    rerender: (rerenderUi: React.ReactElement) =>
      rerender(
        <QueryClientProvider client={queryClient}>
          {rerenderUi}
        </QueryClientProvider>,
      ),
  };
}

/**
 * Create a wrapper with QueryClient for hooks
 */
export const createHookWrapper = () => {
  const queryClient = createTestQueryClient();
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
};

/**
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

type CreateHandlerResponseParams = {
  data: unknown;
  errorMessage: string;
  isError: boolean;
};

/**
 * Format the data response mock and the error for a MSW handler
 */
export const createHandlerResponseMock = ({
  data,
  errorMessage,
  isError,
}: CreateHandlerResponseParams) => {
  if (isError) {
    return { message: errorMessage };
  }
  return {
    status: 200,
    data,
  };
};
