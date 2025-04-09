import { apiClient } from '@ovh-ux/manager-core-api';
import ai from '@/types/AI';
import { PCIAi } from '../..';

export const getRegions = async ({ projectId }: PCIAi) =>
  apiClient.v6
    .get(`/cloud/project/${projectId}/ai/capabilities/region`, {
      headers: {
        'X-Pagination-Mode': 'CachedObjectList-Pages',
        'X-Pagination-Size': '50000',
      },
    })
    .then((res) => res.data as ai.capabilities.Region[]);

export interface AIRegion extends PCIAi {
  region: string;
}

export const getFramework = async ({ projectId, region }: AIRegion) =>
  apiClient.v6
    .get(
      `/cloud/project/${projectId}/ai/capabilities/region/${region}/notebook/framework`,
    )
    .then((res) => res.data as ai.capabilities.notebook.Framework[]);

export const getEditor = async ({ projectId, region }: AIRegion) =>
  apiClient.v6
    .get(
      `/cloud/project/${projectId}/ai/capabilities/region/${region}/notebook/editor`,
    )
    .then((res) => res.data as ai.capabilities.notebook.Editor[]);

export const getFlavor = async ({ projectId, region }: AIRegion) =>
  apiClient.v6
    .get(`/cloud/project/${projectId}/ai/capabilities/region/${region}/flavor`)
    .then((res) => res.data as ai.capabilities.Flavor[]);

export const getAppImages = async ({ projectId, region }: AIRegion) =>
  apiClient.v6
    .get(
      `/cloud/project/${projectId}/ai/capabilities/region/${region}/app/image`,
    )
    .then((res) => res.data as ai.capabilities.app.Image[]);
