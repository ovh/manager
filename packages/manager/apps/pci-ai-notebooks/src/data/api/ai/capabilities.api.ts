import { apiClient } from '@ovh-ux/manager-core-api';
import * as ai from '@/types/cloud/project/ai';
import { PCIAi } from '..';

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
