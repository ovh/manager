import { v6 } from '@ovh-ux/manager-core-api';

export type TFlavor = {
  available: boolean;
  capabilities: {
    name: string;
    enabled: boolean;
  }[];
  disk: number;
  id: string;
  inboundBandwidth?: number;
  name: string;
  osType: string;
  outboundBandwidth?: number;
  planCodes: {
    hourly?: string;
    monthly?: string;
  };
  quota: number;
  ram: number;
  region: string;
  type: string;
  vcpus: number;
  pricingsHourly: {
    price: number;
  };
  pricingsMonthly?: {
    price: number;
  };
};

export const getFlavor = async (
  projectId: string,
  flavorId: string,
): Promise<TFlavor> => {
  const { data } = await v6.get<TFlavor>(
    `/cloud/project/${projectId}/flavor/${flavorId}`,
  );
  return data;
};

export const getFlavors = async (
  projectId: string,
  region: string,
): Promise<TFlavor[]> => {
  const { data } = await v6.get<TFlavor[]>(
    `/cloud/project/${projectId}/flavor?region=${region}`,
  );
  return data;
};

export type TKubeFlavor = {
  category: string;
  gpus: number;
  name: string;
  ram: number;
  state: 'available' | 'unavailable';
  vCPUs: number;
};

export const getKubeFlavors = async (
  projectId: string,
  region?: string,
): Promise<TKubeFlavor[]> => {
  const { data } = await v6.get<TKubeFlavor[]>(
    `/cloud/project/${projectId}/capabilities/kube/flavors?region=${region}`,
  );
  return data;
};
