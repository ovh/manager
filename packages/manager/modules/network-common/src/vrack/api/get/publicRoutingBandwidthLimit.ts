import { v6 } from '@ovh-ux/manager-core-api';

export interface PublicRoutingBandwidthLimit {
  bandwidthLimit: number;
  bandwidthLimitType: 'default' | 'upgraded';
  region: string;
}

export const getPublicRoutingBandwidthLimit = async ({
  serviceName,
  region,
}: {
  serviceName: string;
  region?: string;
}): Promise<PublicRoutingBandwidthLimit[]> => {
  const { data } = await v6.get<PublicRoutingBandwidthLimit[]>(
    `/vrack/${serviceName}/publicRoutingBandwidthLimit${
      region ? `?region=${region}` : ''
    }`,
  );

  return data;
};
