import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import useCalculateTotals from './useCalculateTotal.hook';

describe('useCalculateTotals', () => {
  const mockMetrics = [
    {
      unit: 'input_tokens',
      data: [
        { timestamp: 1672531200, value: 50 },
        { timestamp: 1672617600, value: 30 },
      ],
    },
    {
      unit: 'output_tokens',
      data: [
        { timestamp: 1672531200, value: 20 },
        { timestamp: 1672617600, value: 40 },
      ],
    },
    {
      unit: 'seconds',
      data: [
        { timestamp: 1672531200, value: 120 },
        { timestamp: 1672617600, value: 180 },
      ],
    },
  ];

  it('should calculate totals for input tokens, output tokens, and seconds', async () => {
    const { result } = renderHook(() => useCalculateTotals(mockMetrics));

    await waitFor(() => {
      expect(result.current.totalInputTokens).toBe(80);
      expect(result.current.totalOutputTokens).toBe(60);
      expect(result.current.totalSeconds).toBe(300);
    });
  });

  it('should handle empty metrics gracefully', async () => {
    const { result } = renderHook(() => useCalculateTotals([]));

    await waitFor(() => {
      expect(result.current.totalInputTokens).toBe(0);
      expect(result.current.totalOutputTokens).toBe(0);
      expect(result.current.totalSeconds).toBe(0);
    });
  });

  it('should ignore metrics with unsupported units', async () => {
    const metrics = [
      {
        unit: 'unsupported_unit',
        data: [{ timestamp: 1672531200, value: 100 }],
      },
    ];

    const { result } = renderHook(() => useCalculateTotals(metrics));

    await waitFor(() => {
      expect(result.current.totalInputTokens).toBe(0);
      expect(result.current.totalOutputTokens).toBe(0);
      expect(result.current.totalSeconds).toBe(0);
    });
  });

  it('should update totals when metrics change', async () => {
    const { result, rerender } = renderHook(
      ({ metrics }) => useCalculateTotals(metrics),
      {
        initialProps: { metrics: mockMetrics },
      },
    );

    await waitFor(() => {
      expect(result.current.totalInputTokens).toBe(80);
      expect(result.current.totalOutputTokens).toBe(60);
      expect(result.current.totalSeconds).toBe(300);
    });

    const updatedMetrics = [
      {
        unit: 'input_tokens',
        data: [{ timestamp: 1672531200, value: 100 }],
      },
      {
        unit: 'output_tokens',
        data: [{ timestamp: 1672531200, value: 50 }],
      },
      {
        unit: 'seconds',
        data: [{ timestamp: 1672531200, value: 200 }],
      },
    ];

    rerender({ metrics: updatedMetrics });

    await waitFor(() => {
      expect(result.current.totalInputTokens).toBe(100);
      expect(result.current.totalOutputTokens).toBe(50);
      expect(result.current.totalSeconds).toBe(200);
    });
  });
});
