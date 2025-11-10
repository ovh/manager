import { v6 } from '@ovh-ux/manager-core-api';

import { Logs } from '@/data/types/product/git';

export const deleteGitAssociation = async (
  serviceName: string,
  webSiteId: string,
  deleteFiles?: boolean,
) => {
  const { data } = await v6.delete<void>(
    `/hosting/web/${encodeURIComponent(
      serviceName,
    )}/website/${webSiteId}?deleteFiles=${deleteFiles}`,
  );

  return data;
};

export const fetchHostingWebsiteIds = async (
  serviceName: string,
  path?: string,
): Promise<number[]> => {
  if (!serviceName) {
    throw new Error('Service name is required');
  }

  const query = path ? `?path=${encodeURIComponent(path)}` : '';
  const { data } = await v6.get<number[]>(
    `/hosting/web/${encodeURIComponent(serviceName)}/website${query}`,
  );

  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('No website found for the specified parameters');
  }

  return data;
};

export const fetchWebsiteDeployments = async (
  serviceName: string,
  websiteId: number,
): Promise<number[]> => {
  const { data } = await v6.get<number[]>(
    `/hosting/web/${encodeURIComponent(serviceName)}/website/${websiteId}/deployment`,
  );

  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('No deployments found for the specified website');
  }

  return data;
};

export const fetchDeploymentLogs = async (
  serviceName: string,
  websiteId: number,
  deploymentId: number,
): Promise<Logs[]> => {
  const { data } = await v6.get<Logs[]>(
    `/hosting/web/${encodeURIComponent(
      serviceName,
    )}/website/${websiteId}/deployment/${deploymentId}/logs`,
  );

  return data;
};
