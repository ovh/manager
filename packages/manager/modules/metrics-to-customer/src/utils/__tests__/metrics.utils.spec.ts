import { describe, expect, it } from 'vitest';

import { PrometheusResult } from '@/data/api/metricsClient';
import { buildChartData, isRegionAvailable } from '@/utils/metrics.utils';
import { Region } from '@/types/region.type';

describe('metrics.utils', () => {
  describe('buildChartData', () => {
    it('should return empty array when result has no series', () => {
      // Arrange
      const result: PrometheusResult = {
        status: 'success',
        data: {
          resultType: 'matrix',
          result: [],
        },
      };

      // Act
      const data = buildChartData(result);

      // Assert
      expect(data).toEqual([]);
    });

    it('should return empty array when result.data is undefined', () => {
      // Arrange
      const result = {
        status: 'success',
        data: undefined,
      } as unknown as PrometheusResult;

      // Act
      const data = buildChartData(result);

      // Assert
      expect(data).toEqual([]);
    });

    it('should return empty array when result is null', () => {
      // Arrange
      const result = null as unknown as PrometheusResult;

      // Act
      const data = buildChartData(result);

      // Assert
      expect(data).toEqual([]);
    });

    it('should return empty array when series has no values', () => {
      // Arrange
      const result: PrometheusResult = {
        status: 'success',
        data: {
          resultType: 'matrix',
          result: [
            {
              metric: {},
              values: [],
            },
          ],
        },
      };

      // Act
      const data = buildChartData(result);

      // Assert
      expect(data).toEqual([]);
    });

    it('should build chart data for single series', () => {
      // Arrange
      const result: PrometheusResult = {
        status: 'success',
        data: {
          resultType: 'matrix',
          result: [
            {
              metric: { instance: 'localhost:9090' },
              values: [
                [1704067200, '10.5'], // timestamp in seconds, value as string
                [1704067260, '20.3'],
                [1704067320, '15.7'],
              ],
            },
          ],
        },
      };

      // Act
      const data = buildChartData(result);

      // Assert
      expect(data).toEqual([
        { timestamp: 1704067200000, value: 10.5 },
        { timestamp: 1704067260000, value: 20.3 },
        { timestamp: 1704067320000, value: 15.7 },
      ]);
    });

    it('should build chart data for two series', () => {
      // Arrange
      const result: PrometheusResult = {
        status: 'success',
        data: {
          resultType: 'matrix',
          result: [
            {
              metric: { instance: 'localhost:9090' },
              values: [
                [1704067200, '10.5'],
                [1704067260, '20.3'],
              ],
            },
            {
              metric: { instance: 'localhost:9091' },
              values: [
                [1704067200, '5.2'],
                [1704067260, '8.7'],
              ],
            },
          ],
        },
      };

      // Act
      const data = buildChartData(result);

      // Assert
      expect(data).toEqual([
        { timestamp: 1704067200000, value: 10.5, value1: 5.2 },
        { timestamp: 1704067260000, value: 20.3, value1: 8.7 },
      ]);
    });

    it('should build chart data for three series', () => {
      // Arrange
      const result: PrometheusResult = {
        status: 'success',
        data: {
          resultType: 'matrix',
          result: [
            {
              metric: { instance: 'localhost:9090' },
              values: [
                [1704067200, '10.5'],
                [1704067260, '20.3'],
              ],
            },
            {
              metric: { instance: 'localhost:9091' },
              values: [
                [1704067200, '5.2'],
                [1704067260, '8.7'],
              ],
            },
            {
              metric: { instance: 'localhost:9092' },
              values: [
                [1704067200, '3.1'],
                [1704067260, '4.9'],
              ],
            },
          ],
        },
      };

      // Act
      const data = buildChartData(result);

      // Assert
      expect(data).toEqual([
        { timestamp: 1704067200000, value: 10.5, value1: 5.2, value2: 3.1 },
        { timestamp: 1704067260000, value: 20.3, value1: 8.7, value2: 4.9 },
      ]);
    });

    it('should build chart data for four series', () => {
      // Arrange
      const result: PrometheusResult = {
        status: 'success',
        data: {
          resultType: 'matrix',
          result: [
            {
              metric: { instance: 'localhost:9090' },
              values: [
                [1704067200, '10.5'],
                [1704067260, '20.3'],
              ],
            },
            {
              metric: { instance: 'localhost:9091' },
              values: [
                [1704067200, '5.2'],
                [1704067260, '8.7'],
              ],
            },
            {
              metric: { instance: 'localhost:9092' },
              values: [
                [1704067200, '3.1'],
                [1704067260, '4.9'],
              ],
            },
            {
              metric: { instance: 'localhost:9093' },
              values: [
                [1704067200, '1.5'],
                [1704067260, '2.3'],
              ],
            },
          ],
        },
      };

      // Act
      const data = buildChartData(result);

      // Assert
      expect(data).toEqual([
        {
          timestamp: 1704067200000,
          value: 10.5,
          value1: 5.2,
          value2: 3.1,
          value3: 1.5,
        },
        {
          timestamp: 1704067260000,
          value: 20.3,
          value1: 8.7,
          value2: 4.9,
          value3: 2.3,
        },
      ]);
    });

    it('should handle missing values in series', () => {
      // Arrange
      const result: PrometheusResult = {
        status: 'success',
        data: {
          resultType: 'matrix',
          result: [
            {
              metric: { instance: 'localhost:9090' },
              values: [
                [1704067200, '10.5'],
                [1704067260, '20.3'],
              ],
            },
            {
              metric: { instance: 'localhost:9091' },
              values: [
                [1704067200, '5.2'],
                // Missing second value
              ],
            },
          ],
        },
      };

      // Act
      const data = buildChartData(result);

      // Assert
      expect(data).toEqual([
        { timestamp: 1704067200000, value: 10.5, value1: 5.2 },
        { timestamp: 1704067260000, value: 20.3, value1: 0 },
      ]);
    });

    it('should handle undefined values in series', () => {
      // Arrange
      const result: PrometheusResult = {
        status: 'success',
        data: {
          resultType: 'matrix',
          result: [
            {
              metric: { instance: 'localhost:9090' },
              values: [
                [1704067200, '10.5'],
                [1704067260, undefined as unknown as string],
              ],
            },
          ],
        },
      };

      // Act
      const data = buildChartData(result);

      // Assert
      expect(data).toEqual([
        { timestamp: 1704067200000, value: 10.5 },
        { timestamp: 1704067260000, value: 0 },
      ]);
    });

    it('should convert string values to numbers', () => {
      // Arrange
      const result: PrometheusResult = {
        status: 'success',
        data: {
          resultType: 'matrix',
          result: [
            {
              metric: { instance: 'localhost:9090' },
              values: [
                [1704067200, '10.5'],
                [1704067260, '20'],
                [1704067320, '0'],
                [1704067380, '-5.3'],
              ],
            },
          ],
        },
      };

      // Act
      const data = buildChartData(result);

      // Assert
      expect(data).toEqual([
        { timestamp: 1704067200000, value: 10.5 },
        { timestamp: 1704067260000, value: 20 },
        { timestamp: 1704067320000, value: 0 },
        { timestamp: 1704067380000, value: -5.3 },
      ]);
    });

    it('should convert timestamps from seconds to milliseconds', () => {
      // Arrange
      const result: PrometheusResult = {
        status: 'success',
        data: {
          resultType: 'matrix',
          result: [
            {
              metric: { instance: 'localhost:9090' },
              values: [
                [1704067200, '10.5'], // 2024-01-01 00:00:00 UTC
                [1704067260, '20.3'], // 2024-01-01 00:01:00 UTC
              ],
            },
          ],
        },
      };

      // Act
      const data = buildChartData(result);

      // Assert
      expect(data[0].timestamp).toBe(1704067200000);
      expect(data[1].timestamp).toBe(1704067260000);
      expect(new Date(data[0].timestamp).toISOString()).toBe('2024-01-01T00:00:00.000Z');
      expect(new Date(data[1].timestamp).toISOString()).toBe('2024-01-01T00:01:00.000Z');
    });

    it('should handle series with undefined values array', () => {
      // Arrange
      const result: PrometheusResult = {
        status: 'success',
        data: {
          resultType: 'matrix',
          result: [
            {
              metric: { instance: 'localhost:9090' },
              values: undefined as unknown as [number, string][],
            },
          ],
        },
      };

      // Act
      const data = buildChartData(result);

      // Assert
      expect(data).toEqual([]);
    });

    it('should use first series timestamps when series have different lengths', () => {
      // Arrange
      const result: PrometheusResult = {
        status: 'success',
        data: {
          resultType: 'matrix',
          result: [
            {
              metric: { instance: 'localhost:9090' },
              values: [
                [1704067200, '10.5'],
                [1704067260, '20.3'],
                [1704067320, '15.7'],
              ],
            },
            {
              metric: { instance: 'localhost:9091' },
              values: [
                [1704067200, '5.2'],
                [1704067260, '8.7'],
                // Missing third value
              ],
            },
          ],
        },
      };

      // Act
      const data = buildChartData(result);

      // Assert
      expect(data).toHaveLength(3);
      expect(data).toEqual([
        { timestamp: 1704067200000, value: 10.5, value1: 5.2 },
        { timestamp: 1704067260000, value: 20.3, value1: 8.7 },
        { timestamp: 1704067320000, value: 15.7, value1: 0 },
      ]);
    });

    it('should handle numeric string values correctly', () => {
      // Arrange
      const result: PrometheusResult = {
        status: 'success',
        data: {
          resultType: 'matrix',
          result: [
            {
              metric: { instance: 'localhost:9090' },
              values: [
                [1704067200, '0'],
                [1704067260, '123'],
                [1704067320, '999.999'],
                [1704067380, '1e10'],
              ],
            },
          ],
        },
      };

      // Act
      const data = buildChartData(result);

      // Assert
      expect(data).toEqual([
        { timestamp: 1704067200000, value: 0 },
        { timestamp: 1704067260000, value: 123 },
        { timestamp: 1704067320000, value: 999.999 },
        { timestamp: 1704067380000, value: 10000000000 },
      ]);
    });
  });

  describe('isRegionAvailable', () => {
    it('should return true for supported region', () => {
      // Arrange
      const regions: Region[] = [
        {
          code: 'eu-west-gra',
          name: 'Gravelines',
        },
      ];

      // Act
      const result = isRegionAvailable(regions);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false for unsupported region', () => {
      // Arrange
      const regions: Region[] = [
        {
          code: 'us-east-1',
          name: 'US East',
        },
      ];

      // Act
      const result = isRegionAvailable(regions);

      // Assert
      expect(result).toBe(false);
    });

    it('should return false for empty regions array', () => {
      // Arrange
      const regions: Region[] = [];

      // Act
      const result = isRegionAvailable(regions);

      // Assert
      expect(result).toBe(false);
    });

    it('should return false when region code is undefined', () => {
      // Arrange
      const regions: Region[] = [
        {
          code: undefined as any,
          name: 'Unknown',
        },
      ];

      // Act
      const result = isRegionAvailable(regions);

      // Assert
      expect(result).toBe(false);
    });

    it('should return true if at least one region is supported', () => {
      // Arrange
      const regions: Region[] = [
        {
          code: 'us-east-1',
          name: 'US East',
        },
        {
          code: 'eu-west-gra',
          name: 'Gravelines',
        },
      ];

      // Act
      const result = isRegionAvailable(regions);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false if all regions are unsupported', () => {
      // Arrange
      const regions: Region[] = [
        {
          code: 'us-east-1',
          name: 'US East',
        },
        {
          code: 'ap-south-1',
          name: 'Asia Pacific',
        },
      ];

      // Act
      const result = isRegionAvailable(regions);

      // Assert
      expect(result).toBe(false);
    });
  });
});

