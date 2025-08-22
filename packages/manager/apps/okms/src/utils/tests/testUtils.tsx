import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Handler } from '@ovh-ux/manager-core-test-utils';
import { render } from '@testing-library/react';

// Sets all handlers to 0ms delay
// This avoids the global utils function to set a default delay of 1000ms
export const removeHandlersDelay = (handlers: Handler[]): Handler[] => {
  return handlers.map((handler) => {
    return { ...handler, delay: 0 };
  });
};

export const wait = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

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
        retry: false,
      },
    },
  });

export function renderWithClient(
  ui: React.ReactElement,
): ReturnType<typeof render> & {
  rerender: (rerenderUi: React.ReactElement) => void;
} {
  const testQueryClient = createTestQueryClient();
  const { rerender, ...result } = render(
    <QueryClientProvider client={testQueryClient}>{ui}</QueryClientProvider>,
  );
  return {
    ...result,
    rerender: (rerenderUi: React.ReactElement) =>
      rerender(
        <QueryClientProvider client={testQueryClient}>
          {rerenderUi}
        </QueryClientProvider>,
      ),
  };
}
