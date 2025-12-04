import { describe, expect, it } from 'vitest';
import { toScaling, getInitialValues, SCALING_DEFAULTS } from './scalingHelper';
import ai from '@/types/AI';

describe('Scaling Helper', () => {
  describe('toScaling', () => {
    it('should convert form values to Scaling object', () => {
      const baseScaling = {
        autoScaling: true,
        replicas: 2,
      };

      const formValues = {
        minRep: 2,
        maxRep: 5,
        resType: ai.app.ScalingAutomaticStrategyResourceTypeEnum.CPU,
        averageUsage: 80,
        metricUrl: 'http://example.com',
        dataFormat: ai.app.CustomMetricsFormatEnum.JSON,
        dataLocation: '$.data',
        targetMetricValue: 100,
        aggregationType: ai.app.CustomMetricsAggregationTypeEnum.AVERAGE,
      };

      const result = toScaling(baseScaling, formValues);

      expect(result.replicasMin).toBe(2);
      expect(result.replicasMax).toBe(5);
      expect(result.averageUsageTarget).toBe(80);
      expect(result.resourceType).toBe(
        ai.app.ScalingAutomaticStrategyResourceTypeEnum.CPU,
      );
      expect(result.metricUrl).toBe('http://example.com');
      expect(result.dataFormat).toBe(ai.app.CustomMetricsFormatEnum.JSON);
      expect(result.dataLocation).toBe('$.data');
      expect(result.targetMetricValue).toBe(100);
      expect(result.aggregationType).toBe(
        ai.app.CustomMetricsAggregationTypeEnum.AVERAGE,
      );
    });

    it('should preserve base scaling properties', () => {
      const baseScaling: any = {
        autoScaling: true,
        replicas: 3,
        customProperty: 'test',
      };

      const formValues = {
        minRep: 1,
        maxRep: 3,
        resType: ai.app.ScalingAutomaticStrategyResourceTypeEnum.CPU,
        averageUsage: 75,
      };

      const result: any = toScaling(baseScaling, formValues);

      expect(result.autoScaling).toBe(true);
      expect(result.replicas).toBe(3);
      expect(result.customProperty).toBe('test');
    });
  });

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

      expect(result.minRep).toBe(3);
      expect(result.maxRep).toBe(10);
      expect(result.resType).toBe(
        ai.app.ScalingAutomaticStrategyResourceTypeEnum.RAM,
      );
      expect(result.averageUsage).toBe(85);
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

      expect(result.minRep).toBe(SCALING_DEFAULTS.MIN_REPLICAS);
      expect(result.maxRep).toBe(SCALING_DEFAULTS.MAX_REPLICAS);
      expect(result.resType).toBe(SCALING_DEFAULTS.RESOURCE_TYPE);
      expect(result.averageUsage).toBe(SCALING_DEFAULTS.AVERAGE_USAGE);
      expect(result.metricUrl).toBe('');
      expect(result.dataFormat).toBe(SCALING_DEFAULTS.DATA_FORMAT);
      expect(result.dataLocation).toBe('');
      expect(result.targetMetricValue).toBeUndefined();
      expect(result.aggregationType).toBe(SCALING_DEFAULTS.AGGREGATION_TYPE);
    });

    it('should handle partial scaling objects', () => {
      const scaling = {
        autoScaling: true,
        replicasMin: 5,
        resourceType: ai.app.ScalingAutomaticStrategyResourceTypeEnum.CPU,
      };

      const result = getInitialValues(scaling);

      expect(result.minRep).toBe(5);
      expect(result.maxRep).toBe(SCALING_DEFAULTS.MAX_REPLICAS);
      expect(result.resType).toBe(
        ai.app.ScalingAutomaticStrategyResourceTypeEnum.CPU,
      );
      expect(result.averageUsage).toBe(SCALING_DEFAULTS.AVERAGE_USAGE);
    });
  });
});

