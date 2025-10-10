import { ErrorResponse } from '@/types/api.type';

/**
 * Type guard to check if an error is an ErrorResponse.
 * This is useful for handling API errors when they are not strongly typed.
 */
export const isErrorResponse = (error: unknown): error is ErrorResponse => {
  if (typeof error !== 'object' || error === null) {
    return false;
  }

  const { response } = error as { response?: unknown };
  if (typeof response !== 'object' || response === null) {
    return false;
  }

  const { status, data } = response as { status?: unknown; data?: unknown };
  if (typeof status !== 'number' || typeof data !== 'object' || data === null) {
    return false;
  }

  return 'message' in data;
};
