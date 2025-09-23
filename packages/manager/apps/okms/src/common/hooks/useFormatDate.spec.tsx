import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useFormatDate } from './useFormatDate';

// Mock the manager-react-components hook
const mockFormatDateMrc = vi.fn(({ date }) => date);
vi.mock('@ovh-ux/manager-react-components', () => ({
  useFormatDate: () => mockFormatDateMrc,
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
        format: undefined as undefined,
        expectedFormatCall: 'Pp',
      },
    ];

    testCases.forEach(({ input, format, expectedFormatCall }) => {
      const { result } = renderHook(() => useFormatDate());
      const formattedDate = result.current.formatDate(input, format);

      expect(mockFormatDateMrc).toHaveBeenCalledWith({
        date: input,
        format: expectedFormatCall,
      });
      expect(formattedDate).toBe(input); // The mock returns input for simplicity
    });
  });
});
