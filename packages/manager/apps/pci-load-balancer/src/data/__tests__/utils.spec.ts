import { AxiosError, isAxiosError } from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { isApiErrorResponse } from '../utils';

vi.mock('axios', () => ({
  isAxiosError: vi.fn(),
  AxiosError: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('isApiErrorResponse', () => {
  it('should return true for axios error with response.data.message', () => {
    vi.mocked(isAxiosError).mockReturnValue(true);

    const mockError = {
      response: {
        data: { message: 'API error message' },
      },
    } as unknown;

    expect(isApiErrorResponse(mockError)).toBe(true);
  });

  it('should return false when not an axios error', () => {
    vi.mocked(isAxiosError).mockReturnValue(false);

    expect(isApiErrorResponse(new Error('Regular error'))).toBe(false);
  });

  it('should return false for axios error without response', () => {
    vi.mocked(isAxiosError).mockReturnValue(true);

    const mockError = new AxiosError('Network error');

    expect(isApiErrorResponse(mockError)).toBe(false);
  });

  it('should return false for axios error when data.message is undefined', () => {
    vi.mocked(isAxiosError).mockReturnValue(true);

    const mockError = {
      response: {
        data: {},
      },
    } as unknown;

    expect(isApiErrorResponse(mockError)).toBe(false);
  });
});
