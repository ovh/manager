import { v6 } from '@ovh-ux/manager-core-api';

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
  const response = await v6.get(`/cloud/project/${projectId}`);
  return response.data as Project;
};

export default getProject;
