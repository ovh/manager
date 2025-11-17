import { describe, expect, it } from 'vitest';
import { getInitialValues, SCALING_DEFAULTS } from './scalingHelper';
import ai from '@/types/AI';

describe('Scaling Helper', () => {
  describe('getInitialValues', () => {
    it('should convert Scaling object to form values', () => {
      const scaling = {
        autoScaling: true,
        replicasMin: 3,
        replicasMax: 10,
        resourceType: ai.app.ScalingAutomaticStrategyResourceTypeEnum.RAM,
        averageUsageTarget: 85,
        metricUrl: 'http://example.com/metrics',
        dataFormat: ai.app.CustomMetricsFormatEnum.XML,
        dataLocation: '//data',
        targetMetricValue: 150,
        aggregationType: ai.app.CustomMetricsAggregationTypeEnum.MAX,
      };

      const result = getInitialValues(scaling);

      expect(result.replicasMin).toBe(3);
      expect(result.replicasMax).toBe(10);
      expect(result.resourceType).toBe(
        ai.app.ScalingAutomaticStrategyResourceTypeEnum.RAM,
      );
      expect(result.averageUsageTarget).toBe(85);
      expect(result.metricUrl).toBe('http://example.com/metrics');
      expect(result.dataFormat).toBe(ai.app.CustomMetricsFormatEnum.XML);
      expect(result.dataLocation).toBe('//data');
      expect(result.targetMetricValue).toBe(150);
      expect(result.aggregationType).toBe(
        ai.app.CustomMetricsAggregationTypeEnum.MAX,
      );
    });

    it('should use default values when properties are undefined', () => {
      const scaling = {
        autoScaling: true,
      };

      const result = getInitialValues(scaling);

      expect(result.replicasMin).toBe(SCALING_DEFAULTS.MIN_REPLICAS);
      expect(result.replicasMax).toBe(SCALING_DEFAULTS.MAX_REPLICAS);
      expect(result.resourceType).toBe(SCALING_DEFAULTS.RESOURCE_TYPE);
      expect(result.averageUsageTarget).toBe(SCALING_DEFAULTS.AVERAGE_USAGE);
      expect(result.metricUrl).toBe('');
      expect(result.dataFormat).toBe(SCALING_DEFAULTS.DATA_FORMAT);
      expect(result.dataLocation).toBe('');
      expect(result.targetMetricValue).toBe(0);
      expect(result.aggregationType).toBe(SCALING_DEFAULTS.AGGREGATION_TYPE);
    });

    it('should handle partial scaling objects', () => {
      const scaling = {
        autoScaling: true,
        replicasMin: 5,
        resourceType: ai.app.ScalingAutomaticStrategyResourceTypeEnum.CPU,
      };

      const result = getInitialValues(scaling);

      expect(result.replicasMin).toBe(5);
      expect(result.replicasMax).toBe(SCALING_DEFAULTS.MAX_REPLICAS);
      expect(result.resourceType).toBe(
        ai.app.ScalingAutomaticStrategyResourceTypeEnum.CPU,
      );
      expect(result.averageUsageTarget).toBe(SCALING_DEFAULTS.AVERAGE_USAGE);
    });
  });
});
