import { ApiResponse, v6 } from '@ovh-ux/manager-core-api';

export interface PublicRoutingRegion {
  defaultBandwidthLimit: number;
  publicRoutingType: 'PUBLIC-ROUTING-1-AZ' | 'PUBLIC-ROUTING-3-AZ';
  region: string;
}

export const getPublicRoutingRegion = async ({
  region,
}: {
  region?: string;
} = {}): Promise<ApiResponse<PublicRoutingRegion[]>> =>
  v6.get<PublicRoutingRegion[]>(
    `/vrack/publicRoutingRegion${region ? `?region=${region}` : ''}`,
  );
