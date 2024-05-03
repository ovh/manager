import { v6 } from '@ovh-ux/manager-core-api';
import { TSubnet } from './subnets';

export type TAggregatedNetwork = {
  id: string;
  name: string;
  region: string;
  visibility: string;
  vlanId: number;
  subnets: TSubnet[];
  search?: string;
};

export const getAggregatedNetwork = async (projectId: string) => {
  const { data } = await v6.get<{ resources: TAggregatedNetwork[] }>(
    `/cloud/project/${projectId}/aggregated/network`,
  );

  return data.resources;
};

export const deleteNetwork = async (
  projectId: string,
  region: string,
  networkId: string,
) => {
  const { data } = await v6.delete(
    `/cloud/project/${projectId}/region/${region}/network/${networkId}`,
  );

  return data;
};
