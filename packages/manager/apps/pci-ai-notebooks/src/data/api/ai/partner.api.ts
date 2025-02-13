import { apiClient } from '@ovh-ux/manager-core-api';
import * as ai from '@/types/cloud/project/ai';
import { AIRegion } from './capabilities.api';

export const getPartner = async ({ projectId, region }: AIRegion) =>
  apiClient.v6
    .get(`/cloud/project/${projectId}/ai/partners/region/${region}/partner`)
    .then((res) => res.data as ai.partner.Partner[]);
