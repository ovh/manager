import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Handler } from '@ovh-ux/manager-core-test-utils';
import { render } from '@testing-library/react';
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
        retry: false,
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
  data: any;
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
