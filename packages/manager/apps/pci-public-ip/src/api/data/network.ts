import { v6 } from '@ovh-ux/manager-core-api';
import { Network } from '@/interface';

export interface AggregatedNetwork {
  resources: {
    id: string;
    name: string;
    region: string;
    visibility: string;
    vlanId: number;
  }[];
}

export const getAggregatedNetwork = async (
  projectId: string,
): Promise<AggregatedNetwork> => {
  const { data } = await v6.get<AggregatedNetwork>(
    `/cloud/project/${projectId}/aggregated/network`,
  );
  return data;
};

export const getAllPrivateNetworks = async (
  projectId: string,
): Promise<Network[]> => {
  const { data } = await v6.get<Network[]>(
    `/cloud/project/${projectId}/network/private`,
  );
  return data;
};
