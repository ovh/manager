import { database } from '@/models/database';

export const mockMetric: database.service.Metric = {
  name: 'metric',
  units: database.service.MetricUnitEnum.BYTES,
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
