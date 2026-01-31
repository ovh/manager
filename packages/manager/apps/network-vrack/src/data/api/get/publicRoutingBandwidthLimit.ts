import { v6 } from '@ovh-ux/manager-core-api';

export interface PublicRoutingBandwidthLimit {
  bandwidthLimit: number;
  bandwidthLimitType: 'default' | 'upgraded';
  region: string;
}

export const getPublicRoutingBandwidthLimitQueryKey = (serviceName: string) => [
  `/vrack/${serviceName}/publicRoutingBandwidthLimit`,
];

export const getPublicRoutingBandwidthLimit = async (
  serviceName: string,
): Promise<PublicRoutingBandwidthLimit[]> => {
  const { data } = await v6.get<PublicRoutingBandwidthLimit[]>(
    `/vrack/${serviceName}/publicRoutingBandwidthLimit`,
  );
  return data;
};
