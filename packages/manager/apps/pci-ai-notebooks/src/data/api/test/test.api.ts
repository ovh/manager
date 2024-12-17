import { apiClient } from '@ovh-ux/manager-core-api';
import { PCIAi } from '..';

export interface TestType {
  id?: string;
  delay: number;
  email: string;
  monthlyThreshold: number;
}

export interface TestPostType extends PCIAi {
  test: TestType;
}

export const getTest = async ({ projectId }: PCIAi) =>
  apiClient.v6
    .get(`/cloud/project/${projectId}/alerting`, {
      headers: {
        'X-Pagination-Mode': 'CachedObjectList-Pages',
        'X-Pagination-Size': '50000',
      },
    })
    .then((res) => res.data as string[]);

export const postTest = async ({ projectId, test }: TestPostType) =>
  apiClient.v6
    .post(`/cloud/project/${projectId}/alerting`, test)
    .then((res) => res.data as TestType);

export const deleteTest = async ({ projectId, test }: TestPostType) =>
  apiClient.v6.delete(`/cloud/project/${projectId}/alerting/${test.id}`);
