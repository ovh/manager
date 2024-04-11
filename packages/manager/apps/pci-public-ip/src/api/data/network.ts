import { v6 } from '@ovh-ux/manager-core-api';

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
