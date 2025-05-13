import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import useChartData from './useChartData.hook';

const mockT = (key: string) => {
  const translations: Record<string, string> = {
    input_tokens: 'Input Tokens',
    output_tokens: 'Output Tokens',
    seconds: 'Total Audio',
    ai_endpoints_input: 'Input Tokens',
    ai_endpoints_output: 'Output Tokens',
    ai_endpoints_totalAudio: 'Total Audio',
  };
  return translations[key] || key;
};

describe('useChartData', () => {
  it('should return null when loading', () => {
    const { result } = renderHook(() => useChartData({}, [], true, mockT));

    expect(result.current).toBeNull();
  });

  it('should return null when dataMap is empty', () => {
    const { result } = renderHook(() =>
      useChartData({}, ['Label1', 'Label2'], false, mockT),
    );

    expect(result.current).toBeNull();
  });

  it('should return correctly formatted datasets', () => {
    const mockDataMap = {
      input_tokens: [10, 20, 30],
      output_tokens: [5, 15, 25],
      seconds: [60, 120, 180],
    };
    const labels = ['Jan', 'Feb', 'Mar'];

    const { result } = renderHook(() =>
      useChartData(mockDataMap, labels, false, mockT),
    );

    expect(result.current).not.toBeNull();
    expect(result.current?.labels).toEqual(labels);
    expect(result.current?.datasets).toHaveLength(3);

    const inputDataset = result.current?.datasets.find(
      (d) => d.label === 'Input Tokens',
    );
    expect(inputDataset).toBeDefined();
    expect(inputDataset?.data).toEqual(mockDataMap.input_tokens);
    expect(inputDataset?.borderColor).toBe('#0050D7');

    const outputDataset = result.current?.datasets.find(
      (d) => d.label === 'Output Tokens',
    );
    expect(outputDataset).toBeDefined();
    expect(outputDataset?.data).toEqual(mockDataMap.output_tokens);
    expect(outputDataset?.borderColor).toBe('#A5E9FF');

    const secondsDataset = result.current?.datasets.find(
      (d) => d.label === 'Total Audio',
    );
    expect(secondsDataset).toBeDefined();
    expect(secondsDataset?.data).toEqual(mockDataMap.seconds);
    expect(secondsDataset?.borderColor).toBe('#0050D7');
  });

  it('should filter out unknown units', () => {
    const mockDataMap = {
      input_tokens: [10, 20, 30],
      unknown_unit: [1, 2, 3],
    };
    const labels = ['Jan', 'Feb', 'Mar'];

    const { result } = renderHook(() =>
      useChartData(mockDataMap, labels, false, mockT),
    );

    expect(result.current?.datasets).toHaveLength(1);
    expect(result.current?.datasets[0].label).toBe('Input Tokens');
  });
});
