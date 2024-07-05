import * as database from '@/types/cloud/project/database';

export const mockMetric: database.service.Metric = {
  name: 'cpu_usage_percent',
  units: database.service.MetricUnitEnum.PERCENT,
  metrics: [
    {
      hostname: 'hostname1',
      dataPoints: [
        { value: 10, timestamp: 0 },
        { value: 20, timestamp: 1 },
        { value: 30, timestamp: 2 },
      ],
    },
    {
      hostname: 'hostname2',
      dataPoints: [
        { value: 40, timestamp: 0 },
        { value: 50, timestamp: 1 },
        { value: 60, timestamp: 2 },
      ],
    },
  ],
};

export const mockMetricMem: database.service.Metric = {
  name: 'mem_usage_percent',
  units: database.service.MetricUnitEnum.PERCENT,
  metrics: [
    {
      hostname: 'hostname1',
      dataPoints: [
        { value: 10, timestamp: 0 },
        { value: 20, timestamp: 1 },
        { value: 30, timestamp: 2 },
      ],
    },
  ],
};

export const mockMetricDisk: database.service.Metric = {
  name: 'disk_usage_percent',
  units: database.service.MetricUnitEnum.PERCENT,
  metrics: [
    {
      hostname: 'hostname1',
      dataPoints: [
        { value: 10, timestamp: 0 },
        { value: 20, timestamp: 1 },
        { value: 30, timestamp: 2 },
      ],
    },
  ],
};

export const mockMetricCpu: database.service.Metric = {
  name: 'cpu_usage',
  units: database.service.MetricUnitEnum.PERCENT,
  metrics: [
    {
      hostname: 'hostname1',
      dataPoints: [
        { value: 10, timestamp: 0 },
        { value: 20, timestamp: 1 },
        { value: 30, timestamp: 2 },
      ],
    },
  ],
};
