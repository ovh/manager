import { v6 } from '@ovh-ux/manager-core-api';

export type TSubnetGateway = {
  externalInformation: {
    ips: {
      ip: string;
      subnetId: string;
    }[];
    networkId: string;
  };
  id: string;
  interfaces: {
    id: string;
    ip: string;
    networkId: string;
    subnetId: string;
  }[];
  model: string;
  name: string;
  region: string;
  status: string;
};

export const getSubnetGateways = async (
  projectId: string,
  regionName: string,
  subnetId: string,
) => {
  const { data } = await v6.get<TSubnetGateway[]>(
    `/cloud/project/${projectId}/region/${regionName}/gateway?subnetId=${subnetId}`,
  );

  return data;
};
