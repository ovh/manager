import { v6 } from '@ovh-ux/manager-core-api';

export interface Instance {
  id: string;
  name: string;
  ipAddresses: IPAddress[];
  created: string;
  region: string;
  monthlyBilling: MonthlyBilling | null;
  status: string;
  planCode: string;
  operationIds: string[];
  currentMonthOutgoingTraffic: number;
}

export interface MonthlyBilling {
  since: string;
  status: string;
}

export interface IPAddress {
  ip: string;
  type: string;
  version: number;
  networkId: string;
  gatewayIp: string | null;
}

export const getInstance = async (
  projectId: string,
  instanceId: string,
): Promise<Instance> => {
  const { data } = await v6.get<Instance>(
    `/cloud/project/${projectId}/instance/${instanceId}`,
  );
  return data;
};
