import { v6 } from '@ovh-ux/manager-core-api';
import type {
  TMonitoringData,
  TMonitoringDataPoint,
  TMonitoringPeriod,
} from '@/domain/entities/monitoring';

type TMonitoringResponseDTO = {
  values: Array<{
    timestamp: number;
    value: number;
  }>;
};

const mapMonitoringDataPoints = (
  data: TMonitoringResponseDTO,
): Array<TMonitoringDataPoint> =>
  data.values.map((point) => ({
    timestamp: point.timestamp,
    value: point.value,
  }));

export const getCpuMonitoring = async (
  serviceName: string,
  period: TMonitoringPeriod,
): Promise<Array<TMonitoringDataPoint>> => {
  const { data } = await v6.get<TMonitoringResponseDTO>(
    `/vps/${serviceName}/monitoring`,
    {
      params: {
        period,
        type: 'cpu:used',
      },
    },
  );
  return mapMonitoringDataPoints(data);
};

export const getMemoryMonitoring = async (
  serviceName: string,
  period: TMonitoringPeriod,
): Promise<Array<TMonitoringDataPoint>> => {
  const { data } = await v6.get<TMonitoringResponseDTO>(
    `/vps/${serviceName}/monitoring`,
    {
      params: {
        period,
        type: 'mem:used',
      },
    },
  );
  return mapMonitoringDataPoints(data);
};

export const getNetworkMonitoring = async (
  serviceName: string,
  period: TMonitoringPeriod,
): Promise<{
  rx: Array<TMonitoringDataPoint>;
  tx: Array<TMonitoringDataPoint>;
}> => {
  const [rxResponse, txResponse] = await Promise.all([
    v6.get<TMonitoringResponseDTO>(`/vps/${serviceName}/monitoring`, {
      params: {
        period,
        type: 'net:rx',
      },
    }),
    v6.get<TMonitoringResponseDTO>(`/vps/${serviceName}/monitoring`, {
      params: {
        period,
        type: 'net:tx',
      },
    }),
  ]);

  return {
    rx: mapMonitoringDataPoints(rxResponse.data),
    tx: mapMonitoringDataPoints(txResponse.data),
  };
};

export const getFullMonitoring = async (
  serviceName: string,
  period: TMonitoringPeriod,
): Promise<TMonitoringData> => {
  const [cpu, memory, network] = await Promise.all([
    getCpuMonitoring(serviceName, period),
    getMemoryMonitoring(serviceName, period),
    getNetworkMonitoring(serviceName, period),
  ]);

  return {
    cpu,
    memory,
    networkRx: network.rx,
    networkTx: network.tx,
  };
};
