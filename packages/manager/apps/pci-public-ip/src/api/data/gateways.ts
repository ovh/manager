import { v6 } from '@ovh-ux/manager-core-api';

export type TGateway = {
  id: string;
  status: string;
  name: string;
  region: string;
  interfaces: {
    id: string;
    ip: string;
    subnetId: string;
    networkId: string;
  }[];
  externalInformation:
    | {
        networkId: string;
        ips: {
          ip: string;
          subnetId: string;
        }[];
      }
    | 'undefined';
};

export const getGatewaysUrl = (projectId: string, region: string) =>
  `/cloud/project/${projectId}/region/${region}/gateway`;

export const getGateways = async (
  projectId: string,
  ipRegion: string,
): Promise<TGateway[]> => {
  const { data } = await v6.get(getGatewaysUrl(projectId, ipRegion));
  return data as TGateway[];
};
