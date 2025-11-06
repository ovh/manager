import { PathParams } from 'msw';
import { Handler } from '@ovh-ux/manager-core-test-utils';
import { ErrorResponse } from '@/types/api.type';

type BuildHandlerResponseParams<T = unknown> = {
  data: T | ((request: Request, params: PathParams) => T);
  errorMessage: string;
  isError: boolean;
};

type BuildHandlerResponse<T = unknown> =
  | T
  | ((request: Request, params: PathParams) => T)
  | ErrorResponse['response']['data'];

/**
 * Format the data response mock and the error for a MSW handler
 * The data parameter can be a static value of type T, or a function that returns a value of type T
 * Return: T, or a function that returns T, or an error response
 */
export function buildMswResponseMock<T = unknown>({
  data,
  errorMessage,
  isError,
}: BuildHandlerResponseParams<T>): BuildHandlerResponse<T> {
  if (isError) {
    return {
      message: errorMessage,
    };
  }
  return data;
}

/**
 * Set all handlers to 0ms delay
 * This avoids the global utils function to set a default delay of 1000ms
 */
export const removeHandlersDelay = (handlers: Handler[]): Handler[] => {
  return handlers.map((handler) => {
    return { ...handler, delay: 0 };
  });
};
