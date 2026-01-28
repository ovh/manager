import {
  ApiResponse,
  IcebergFetchResultV6,
  apiClient,
  fetchIcebergV6,
} from '@ovh-ux/manager-core-api';
import { IamObject } from '@ovh-ux/manager-react-components';
import { Query } from '@tanstack/react-query';
import { ServiceStatus } from '@/types';

export type DedicatedServer = {
  ip: string;
  linkSpeed: number;
  newUpgradeSystem: boolean;
  region: string;
  name: string;
  commercialRange: string | null;
  rack: string;
  rescueSshKey: null;
  supportLevel: 'pro' | 'critical' | 'fastpath' | 'gs';
  os: string;
  efiBootloaderPath: string | null;
  rootDevice: string | null;
  professionalUse: boolean;
  rescueMail: string | null;
  bootId: number;
  serverId: number;
  bootScript: string | null;
  availabilityZone: string;
  state: 'ok' | 'error' | 'hacked' | 'hackedBlocked';
  datacenter: string;
  monitoring: boolean;
  reverse: string;
  powerState: 'poweron' | 'poweroff';
  noIntervention: boolean;
  iam: IamObject;
};

export const getDedicatedServerData = (
  serverName: string,
): Promise<ApiResponse<DedicatedServer>> =>
  apiClient.v6.get(`/dedicated/server/${serverName}`);

export type DedicatedServerServiceInfos = {
  canDeleteAtExpiration: boolean;
  contactAdmin: string;
  contactBilling: string;
  contactTech: string;
  creation: string;
  domain: string;
  engagedUpTo: string;
  expiration: string;
  possibleRenewPeriod: number[];
  renew: {
    automatic: boolean;
    deleteAtExpiration: boolean;
    forced: boolean;
    manualPayment: boolean | null;
    period: number | null;
  } | null;
  renewalType:
    | 'automaticForcedProduct'
    | 'automaticV2012'
    | 'automaticV2014'
    | 'automaticV2016'
    | 'automaticV2024'
    | 'manual'
    | 'oneShot'
    | 'option';
  serviceId: number;
  status: ServiceStatus;
};

export type DedicatedServerNetworkSpecifications = {
  vmac: {
    quota: number;
    supported: boolean;
  };
};

export const getDedicatedServerServiceInfos = (
  serviceName: string,
): Promise<ApiResponse<DedicatedServerServiceInfos>> =>
  apiClient.v6.get(`/dedicated/server/${serviceName}/serviceInfos`);

export const getDedicatedServerNetworkSpecifications = (
  serviceName: string,
): Promise<ApiResponse<DedicatedServerNetworkSpecifications>> =>
  apiClient.v6.get(`/dedicated/server/${serviceName}/specifications/network`);

export const getDedicatedServerVmac = (
  serviceName: string,
): Promise<ApiResponse<string[]>> =>
  apiClient.v6.get(`/dedicated/server/${serviceName}/virtualMac`);

export type OrderableIp = {
  optionRequired?: 'professionalUse' | null;
  blockSizes: number[];
  included: boolean;
  ipNumber: number | null;
  number: number;
  type: 'failover' | 'unshielded' | 'static';
};

export type OrderableIpResponse = {
  ipv4: OrderableIp[];
  ipv6: OrderableIp[];
};

export const getDedicatedServerOrderableIp = (
  serverName: string,
): Promise<ApiResponse<OrderableIpResponse>> =>
  apiClient.v6.get(`/dedicated/server/${serverName}/orderable/ip`);

export const getDedicatedServerAvailableCountries = (
  serviceName: string,
): Promise<ApiResponse<string[]>> =>
  apiClient.v6.get(`/dedicated/server/${serviceName}/ipCountryAvailable`);

export type GetDedicatedServerTasksParams = {
  serviceName: string;
  taskFunction: string;
  status: string;
};

export type DedicatedServerTaskResponse = {
  comment: string | null;
  doneDate: string | null;
  function: string;
  lastUpdate: string;
  needSchedule: boolean;
  note: string | null;
  plannedInterventionId: number | null;
  startDate: string;
  status:
    | 'cancelled'
    | 'doing'
    | 'done'
    | 'ovhError'
    | 'customerError'
    | 'init'
    | 'todo';
  tags: { key: string; value: string }[];
  taskId: number;
  ticketReference: string | null;
};

const getDedicatedServerTasksBaseQueryKey = (serviceName: string): string =>
  `get/dedicated/server/${encodeURIComponent(serviceName)}/task`;

export const getDedicatedServerTasksQueryKey = ({
  serviceName,
  taskFunction,
  status,
}: GetDedicatedServerTasksParams) => [
  getDedicatedServerTasksBaseQueryKey(serviceName),
  { taskFunction, status },
];

export const getDedicatedServerTaskQueryKey = (
  serviceName: string,
  taskId: number,
) => [`get/dedicated/server/${encodeURIComponent(serviceName)}/task/${taskId}`];

export const createDedicatedServerTasksQueryKeyPredicate = (
  serviceName: string,
  functionList: string[],
) => ({ queryKey }: Query) =>
  queryKey[0] === getDedicatedServerTasksBaseQueryKey(serviceName) &&
  functionList.includes(
    (queryKey[1] as { taskFunction: string })?.taskFunction,
  );

export const getDedicatedServerTasks = async ({
  serviceName,
  taskFunction,
  status,
}: GetDedicatedServerTasksParams): Promise<ApiResponse<number[]>> =>
  apiClient.v6.get<number[]>(
    `/dedicated/server/${encodeURIComponent(
      serviceName,
    )}/task?function=${taskFunction}&status=${status}`,
  );

export const getDedicatedServerTask = async (
  serviceName: string,
  taskId: number,
): Promise<ApiResponse<DedicatedServerTaskResponse>> =>
  apiClient.v6.get<DedicatedServerTaskResponse>(
    `/dedicated/server/${encodeURIComponent(serviceName)}/task/${taskId}`,
  );

export const getIcebergDedicatedServerTasksQueryKey = (serviceName: string) => [
  getDedicatedServerTasksBaseQueryKey(serviceName),
  'iceberg',
];

export const getIcebergDedicatedServerTask = async (
  serviceName: string,
): Promise<IcebergFetchResultV6<DedicatedServerTaskResponse>> =>
  fetchIcebergV6({
    route: `/dedicated/server/${encodeURIComponent(serviceName)}/task`,
    pageSize: 10000,
    page: 1,
    disableCache: true,
  });
