import { v6 } from '@ovh-ux/manager-core-api';

import { TProject } from '@/types/pci-common.types';

type FetchResultV6<T> = {
  data: T[];
};

export const getProjects = async (): Promise<FetchResultV6<TProject>> => {
  const headers: Record<string, string> = {
    'x-pagination-mode': 'CachedObjectList-Pages',
  };
  return v6.get(`/cloud/project`, { headers });
};

/**
 * Delete a project based on the region.
 */
export const removeProject = (params: {
  projectId: string;
  serviceId?: string;
  isUs?: boolean;
}): Promise<unknown> => {
  const { projectId, serviceId, isUs = false } = params;

  if (isUs) {
    return v6.delete(`/services/${serviceId}`);
  }
  return v6.post(`cloud/project/${projectId}/terminate`);
};

export const editProject = async ({
  projectId,
  payload,
}: {
  projectId: string;
  payload: { description?: string };
}): Promise<unknown> => {
  const { data } = await v6.put<unknown>(`cloud/project/${projectId}`, payload);
  return data;
};

export const setAsDefaultProject = async (projectId: string): Promise<unknown> => {
  const { data } = await v6.post<unknown>('me/preferences/manager', {
    key: 'PUBLIC_CLOUD_DEFAULT_PROJECT',
    value: JSON.stringify({ projectId }),
  });

  return data;
};

export const unFavProject = async (): Promise<unknown> => {
  const { data } = await v6.delete<unknown>('me/preferences/manager/PUBLIC_CLOUD_DEFAULT_PROJECT');

  return data;
};

/**
 * Retrieves the user's default public cloud project preference.
 * @returns {Promise<{ projectId: string } | null>} The default project object or null if not set.
 */
export const getDefaultProject = async (): Promise<{
  projectId: string;
} | null> => {
  try {
    const { data } = await v6.get<{ value: string }>(
      'me/preferences/manager/PUBLIC_CLOUD_DEFAULT_PROJECT',
    );

    const { projectId } = JSON.parse(String(data.value)) as {
      projectId: string;
    };
    return { projectId };
  } catch {
    return null;
  }
};

/**
 * Claims a voucher for a project
 * @param projectId - The project ID
 * @param voucherCode - The voucher code to claim
 * @returns Promise<void>
 */
export const claimVoucher = async (projectId: string, voucherCode: string): Promise<void> => {
  await v6.post(`/cloud/project/${projectId}/credit`, {
    code: voucherCode,
  });
};
