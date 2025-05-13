import { v6 } from '@ovh-ux/manager-core-api';
import {
  LoadBalancerOperatingStatusEnum,
  LoadBalancerProvisioningStatusEnum,
} from './load-balancer';

export type THealthMonitorType = 'tcp' | 'udp' | 'http' | 'https' | 'sctp';
export type THealthMonitor = {
  id: string;
  name: string;
  operatingStatus: LoadBalancerOperatingStatusEnum;
  provisioningStatus: LoadBalancerProvisioningStatusEnum;
  monitorType: THealthMonitorType;
  delay: number;
  timeout: number;
  maxRetries: number;
  maxRetriesDown: number;
  httpConfiguration: null | {
    method: string;
    expectedCodes: number;
    urlPath: string;
  };
  poolId: string;
};

export const getHealthMonitor = async (
  projectId: string,
  region: string,
  poolId: string,
): Promise<[THealthMonitor]> => {
  const { data } = await v6.get<[THealthMonitor]>(
    `/cloud/project/${projectId}/region/${region}/loadbalancing/healthMonitor?poolId=${poolId}`,
  );
  return data;
};

export const deleteHealthMonitor = async (
  projectId: string,
  region: string,
  healthMonitorId: string,
) => {
  const { data } = await v6.delete(
    `/cloud/project/${projectId}/region/${region}/loadbalancing/healthMonitor/${healthMonitorId}`,
  );
  return data;
};

export type THealthMonitorFormState = {
  name?: string;
  type?: THealthMonitor['monitorType'];
  urlPath?: string;
  expectedCode?: number;
  maxRetriesDown: number;
  delay: number;
  maxRetries: number;
  timeout: number;
};

export const createHealthMonitor = (
  projectId: string,
  region: string,
  poolId: string,
  model: THealthMonitorFormState,
) => {
  const body = {
    maxRetries: model.maxRetries,
    maxRetriesDown: model.maxRetriesDown,
    monitorType: model.type,
    name: model.name,
    delay: model.delay,
    poolId,
    timeout: model.timeout,
    ...(model.urlPath && model.expectedCode
      ? {
          httpConfiguration: {
            expectedCodes: `${model.expectedCode}`,
            httpMethod: 'GET',
            httpVersion: '1.0',
            urlPath: model.urlPath,
          },
        }
      : {}),
  };

  return v6.post(
    `/cloud/project/${projectId}/region/${region}/loadbalancing/healthMonitor`,
    body,
  );
};

export const editHealthMonitor = (
  projectId: string,
  region: string,
  healthMonitorId: string,
  model: THealthMonitorFormState,
) => {
  const body = {
    maxRetries: model.maxRetries,
    maxRetriesDown: model.maxRetriesDown,
    name: model.name,
    delay: model.delay,
    timeout: model.timeout,
    ...(model.urlPath && model.expectedCode
      ? {
          httpConfiguration: {
            expectedCodes: model.expectedCode.toString(),
            httpMethod: 'GET',
            httpVersion: '1.0',
            urlPath: model.urlPath,
          },
        }
      : {}),
  };

  return v6.put(
    `/cloud/project/${projectId}/region/${region}/loadbalancing/healthMonitor/${healthMonitorId}`,
    body,
  );
};

export const renameHealthMonitor = (
  projectId: string,
  region: string,
  healthMonitorId: string,
  name: string,
) =>
  v6.put(
    `/cloud/project/${projectId}/region/${region}/loadbalancing/healthMonitor/${healthMonitorId}`,
    { name },
  );
