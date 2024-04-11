import { v6 } from '@ovh-ux/manager-core-api';
import { Gateway } from '@/interface';

export const getGateways = async (
  projectId: string,
  regionName: string,
): Promise<Gateway[]> => {
  const { data } = await v6.get<Gateway[]>(
    `/cloud/project/${projectId}/region/${regionName}/gateway`,
  );
  return data;
};

export const getGatewayDetails = async (
  projectId: string,
  region: string,
  gatewayId: string,
): Promise<Gateway> => {
  const { data } = await v6.get<Gateway>(
    `/cloud/project/${projectId}/region/${region}/gateway/${gatewayId}`,
  );
  return data;
};
