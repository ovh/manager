import { useParams } from 'react-router-dom';
import { QueryOptions, useQuery } from '@tanstack/react-query';

import { v6 } from '@ovh-ux/manager-core-api';

import { DISCOVERY_PROJECT_PLANCODE } from './constants';
import { PublicCloudProject } from './publicCloudProject.interface';

export interface ResponseAPIError {
  message: string;
  stack: string;
  name: string;
  code: string;
  response?: {
    headers?: {
      [key: string]: string;
      'x-ovh-queryid': string;
    };
    data?: {
      message?: string;
    };
  };
}

export const getProject = async (
  projectId: string,
): Promise<PublicCloudProject> => {
  const { data } = await v6.get<PublicCloudProject>(
    `/cloud/project/${projectId}`,
  );
  return data;
};

export const getProjectQuery = (projectId: string) => ({
  queryKey: ['project', projectId],
  queryFn: () => getProject(projectId),
});

export const useProject = (
  projectId?: string,
  opt?: QueryOptions<PublicCloudProject, ResponseAPIError>,
) => {
  const { projectId: defaultProjectId } = useParams();
  return useQuery({
    ...getProjectQuery(projectId || defaultProjectId),
    ...opt,
  });
};

export const useIsDiscoveryProject = (projectId?: string) => {
  const { data: project } = useProject(projectId);
  return project?.planCode === DISCOVERY_PROJECT_PLANCODE;
};

export type TProjectQuota = {
  region: string;
  instance: {
    maxCores: number;
    maxInstances: number;
    maxRam: number;
    usedCores: number;
    usedInstances: number;
    usedRAM: number;
  };
  keypair: {
    maxCount: number;
  };
  volume: {
    maxGigabytes: number;
    usedGigabytes: number;
    volumeCount: number;
    maxVolumeCount: number;
    maxBackupGigabytes: number;
    usedBackupGigabytes: number;
    volumeBackupCount: number;
    maxVolumeBackupCount: number;
  };
  network: {
    maxNetworks: number;
    usedNetworks: number;
    maxSubnets: number;
    usedSubnets: number;
    maxFloatingIPs: number;
    usedFloatingIPs: number;
    maxGateways: number;
    usedGateways: number;
  };
  loadbalancer: {
    maxLoadbalancers: number;
    usedLoadbalancers: number;
  } | null;
  keymanager: {
    maxSecrets: number;
    usedSecrets: number;
  } | null;
  share: any | null;
};

export const getProjectQuota = async (projectId: string) => {
  const { data } = await v6.get<TProjectQuota[]>(
    `/cloud/project/${projectId}/quota`,
  );

  return data;
};

export const useProjectQuota = (projectId: string) =>
  useQuery({
    queryKey: ['project', projectId, 'quota'],
    queryFn: () => getProjectQuota(projectId),
  });
