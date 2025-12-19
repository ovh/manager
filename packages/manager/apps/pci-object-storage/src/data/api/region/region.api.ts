import { Region } from '@datatr-ux/ovhcloud-types/cloud/index';
import { PCIData } from '..';
import {
  IcebergPaginationHeaders,
  NoCacheHeaders,
  apiClient,
  createHeaders,
} from '../api.client';

export const getRegions = async ({ projectId }: PCIData) =>
  apiClient.v6.get<Region[]>(`/cloud/project/${projectId}/region`, {
    headers: createHeaders(NoCacheHeaders, IcebergPaginationHeaders),
  });
