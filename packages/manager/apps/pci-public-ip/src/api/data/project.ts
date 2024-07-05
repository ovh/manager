import { v6, fetchIcebergV6 } from '@ovh-ux/manager-core-api';

export type TProjectStatus =
  | 'creating'
  | 'deleted'
  | 'deleting'
  | 'ok'
  | 'suspended';

export type Project = {
  access: 'full' | 'restricted';
  creationDate: string;
  description?: string;
  expiration?: string | null;
  iam: {
    displayName?: string;
    id: string;
    tags?: Record<string, string>;
    urn: string;
  };
  manualQuota: boolean;
  orderId: number | null;
  planCode: string;
  projectName: string | null;
  project_id: string;
  status: TProjectStatus;
  unleash: boolean;
};

export const getProject = async (projectId: string): Promise<Project> => {
  const { data } = await v6.get<Project>(`/cloud/project/${projectId}`);
  return data;
};

export interface Region {
  continentCode: string;
  datacenterLocation: string;
  name: string;
  status: string;
  type: string;
}

export const getProjectRegions = async (
  projectId: string,
): Promise<Region[]> => {
  const { data } = await fetchIcebergV6<Region>({
    route: `/cloud/project/${projectId}/region`,
  });
  return data;
};

export default getProject;
