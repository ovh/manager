export type TMonitoringPeriod = 'day' | 'week' | 'month' | 'year';

export type TMonitoringDataPoint = {
  timestamp: number;
  value: number;
};

export type TMonitoringData = {
  cpu: Array<TMonitoringDataPoint>;
  memory: Array<TMonitoringDataPoint>;
  networkRx: Array<TMonitoringDataPoint>;
  networkTx: Array<TMonitoringDataPoint>;
};
