import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import useGenerateMetricData from './useGenerateMetricData.hook';

describe('useGenerateMetricData', () => {
  const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const initialStartDate = new Date(2025, 0, 1);
  const initialEndDate = new Date(2025, 0, 10);

  it('should generate daily labels for a short time range', () => {
    const { result } = renderHook(() =>
      useGenerateMetricData(initialStartDate, initialEndDate),
    );
    const { labels } = result.current;

    expect(labels.length).toBe(10);
    expect(labels[0]).toBe(formatDate(new Date(2025, 0, 1)));
    expect(labels[labels.length - 1]).toBe(formatDate(new Date(2025, 0, 10)));
  });

  it('should generate weekly labels for a time range greater than 2 months but less than 12 months', () => {
    const testStartDate = new Date(2024, 5, 1);
    const testEndDate = new Date(2024, 6, 15);
    const { result } = renderHook(() =>
      useGenerateMetricData(testStartDate, testEndDate),
    );
    const { labels } = result.current;

    expect(labels).toContain(formatDate(new Date(2024, 5, 1)));
    expect(labels).toContain(formatDate(new Date(2024, 5, 8)));
    expect(labels).toContain(formatDate(new Date(2024, 6, 6)));
  });

  it('should generate monthly labels for a range longer than 12 months', () => {
    const longStartDate = new Date(2023, 0, 1);
    const longEndDate = new Date(2025, 0, 1);
    const { result } = renderHook(() =>
      useGenerateMetricData(longStartDate, longEndDate),
    );
    const { labels } = result.current;

    expect(labels).toContain('2023-01');
    expect(labels).toContain('2024-12');
    expect(labels.length).toBe(25);
  });

  it('should map data correctly to labels', () => {
    const metrics = [
      {
        unit: 'input_tokens',
        data: [
          {
            timestamp: Math.floor(new Date('2025-01-01').getTime() / 1000),
            value: 22,
          },
          {
            timestamp: Math.floor(new Date('2025-01-02').getTime() / 1000),
            value: 24,
          },
        ],
      },
    ];

    const { result } = renderHook(() =>
      useGenerateMetricData(initialStartDate, initialEndDate, metrics),
    );
    const { dataMap } = result.current;

    expect(dataMap).toHaveProperty('input_tokens');
    expect(dataMap.input_tokens.length).toBe(10);
    expect(dataMap.input_tokens[0]).toBe(22);
    expect(dataMap.input_tokens[1]).toBe(24);
  });

  it('should generate hourly labels for the same day', () => {
    const hourlyStartDate = new Date(2025, 0, 1, 10);
    const hourlyEndDate = new Date(2025, 0, 1, 14);
    const { result } = renderHook(() =>
      useGenerateMetricData(hourlyStartDate, hourlyEndDate),
    );
    const { labels } = result.current;

    expect(labels.length).toBe(24);

    const expectedLabels = ['10:00', '11:00', '12:00', '13:00', '14:00'];
    const filteredLabels = labels.filter((label) => {
      const hour = parseInt(label.split(':')[0], 10);
      return hour >= 10 && hour <= 14;
    });

    expect(filteredLabels).toEqual(expectedLabels);
  });

  it('should handle edge case with no metrics', () => {
    const { result } = renderHook(() =>
      useGenerateMetricData(initialStartDate, initialEndDate, []),
    );
    const { dataMap } = result.current;

    expect(dataMap).toEqual({});
  });

  it('should return empty labels if the range is invalid', () => {
    const invalidStartDate = new Date(2025, 0, 10);
    const invalidEndDate = new Date(2025, 0, 1);

    const { result } = renderHook(() =>
      useGenerateMetricData(invalidStartDate, invalidEndDate),
    );

    const { labels } = result.current;

    expect(labels.length).toBe(0);
    expect(labels).toEqual([]);
  });

  it('should map unknown unit to its correct label', () => {
    const metrics = [
      {
        unit: 'input',
        data: [
          {
            timestamp: Math.floor(new Date('2025-01-01').getTime() / 1000),
            value: 15,
          },
        ],
      },
    ];

    const { result } = renderHook(() =>
      useGenerateMetricData(initialStartDate, initialEndDate, metrics),
    );
    const { dataMap } = result.current;

    expect(dataMap).toHaveProperty('input_tokens');
    expect(dataMap.input_tokens.length).toBe(10);
    expect(dataMap.input_tokens[0]).toBe(15);
  });
});
