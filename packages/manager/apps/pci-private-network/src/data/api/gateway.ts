import { v6 } from '@ovh-ux/manager-core-api';
import { TGateway } from '@/types/gateway.type';
import { getSubnets } from './networks';

export const getGatewaysByRegion = async (
  projectId: string,
  regionName: string,
) => {
  const { data } = await v6.get<TGateway[]>(
    `/cloud/project/${projectId}/region/${regionName}/gateway`,
  );

  return data;
};

export const associateGateway = async (
  projectId: string,
  region: string,
  gatewayId: string,
  subnetId: string,
) => {
  const { data } = await v6.post(
    `/cloud/project/${projectId}/region/${region}/gateway/${gatewayId}/interface`,
    {
      subnetId,
    },
  );

  return data;
};

export const assignGatewayToOperation = async (
  projectId: string,
  region: string,
  resourceId: string,
  gatewayId: string,
) => {
  const subnets = await getSubnets(projectId, region, resourceId);

  await associateGateway(projectId, region, gatewayId, subnets[0].id);
};
