import { v6 } from '@ovh-ux/manager-core-api';
import { TSubnet } from './subnets';

export type TAggregatedNetwork = {
  id: string;
  name: string;
  region: string;
  visibility: string;
  vlanId: number;
  subnets: TSubnet[];
};

export const getAggregatedNetwork = async (projectId: string) => {
  const { data } = await v6.get<{ resources: TAggregatedNetwork[] }>(
    `/cloud/project/${projectId}/aggregated/network`,
  );

  return data.resources;
};
