import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useFormatDate } from './useFormatDate';

// Mock the muk hook
const mockFormatDate = vi.fn(({ date }: { date: string }) => date);
vi.mock('@ovh-ux/muk', () => ({
  useFormatDate: () => mockFormatDate,
}));

describe('useFormatDate', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should handle different date formats correctly', () => {
    const testCases = [
      {
        // short format
        input: '2025-06-15T12:45:30Z',
        format: 'short' as const,
        expectedFormatCall: 'P',
      },
      {
        // long format
        input: '2025-06-15T12:45:30Z',
        format: 'long' as const,
        expectedFormatCall: 'Pp',
      },
      {
        // default format (long)
        input: '2025-06-15T12:45:30Z',
        format: undefined,
        expectedFormatCall: 'Pp',
      },
    ];

    testCases.forEach(({ input, format, expectedFormatCall }) => {
      const { result } = renderHook(() => useFormatDate());
      const formattedDate = result.current.formatDate(input, format);

      expect(mockFormatDate).toHaveBeenCalledWith({
        date: input,
        format: expectedFormatCall,
      });
      expect(formattedDate).toBe(input); // The mock returns input for simplicity
    });
  });
});
