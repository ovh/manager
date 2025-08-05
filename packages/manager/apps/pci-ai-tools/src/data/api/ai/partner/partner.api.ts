import { apiClient } from '@ovh-ux/manager-core-api';
import { AIRegion } from '../capabilities/capabilities.api';
import ai from '@/types/AI';
import { PCIAi } from '../..';

export const getPartner = async ({ projectId, region }: AIRegion) =>
  apiClient.v6
    .get(`/cloud/project/${projectId}/ai/partners/region/${region}/partner`)
    .then((res) => res.data as ai.partner.Partner[]);

export interface PartnerApp extends PCIAi {
  region: string;
  partnerId: string;
}

export const signPartnerContract = async ({
  projectId,
  region,
  partnerId,
}: PartnerApp) =>
  apiClient.v6
    .post(
      `/cloud/project/${projectId}/ai/partners/region/${region}/partner/${partnerId}/contract/signature`,
    )
    .then((res) => res.data as ai.partner.Contract);
