import type { ApiError } from '@ovh-ux/manager-core-api';

/**
 * Error structure for Error component from MUK
 */
export type ErrorBannerError = {
  data: {
    message?: string;
  };
  headers?: Record<string, unknown>;
};

/**
 * Map unknown error types to ErrorBannerError format
 * Handles API errors, network errors, and unknown errors
 * @param error - Unknown error type
 * @returns Normalized error structure for Error component
 */
export function mapUnknownErrorToBannerError(
  error: unknown,
): ErrorBannerError {
  // Handle ApiError from manager-core-api
  if (
    error &&
    typeof error === 'object' &&
    'response' in error &&
    'message' in error
  ) {
    const apiError = error as ApiError;
    return {
      data: {
        message:
          apiError.response?.data?.message || apiError.message || 'Unknown error',
      },
      headers: apiError.response?.headers || {},
    };
  }

  // Handle standard Error
  if (error instanceof Error) {
    return {
      data: {
        message: error.message,
      },
      headers: {},
    };
  }

  // Handle unknown error types
  return {
    data: {
      message: 'An unexpected error occurred',
    },
    headers: {},
  };
}

