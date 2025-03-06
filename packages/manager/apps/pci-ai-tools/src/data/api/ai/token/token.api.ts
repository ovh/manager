import { apiClient } from '@ovh-ux/manager-core-api';
import * as ai from '@datatr-ux/ovhcloud-types/cloud/project/ai/index';
import { PCIAi } from '../..';

export const getTokens = async ({ projectId }: PCIAi) =>
  apiClient.v6
    .get(`/cloud/project/${projectId}/ai/token`)
    .then((res) => res.data as ai.token.Token[]);

export interface TokenProps extends PCIAi {
  tokenId: string;
}
export const getToken = async ({ projectId, tokenId }: TokenProps) =>
  apiClient.v6
    .get(`/cloud/project/${projectId}/ai/token/${tokenId}`)
    .then((res) => res.data as ai.token.Token);

export interface AddTokenProps extends PCIAi {
  token: ai.token.TokenSpec;
}
export const addToken = async ({ projectId, token }: AddTokenProps) =>
  apiClient.v6
    .post(`/cloud/project/${projectId}/ai/token`, token)
    .then((res) => res.data as ai.token.Token);

export const deleteToken = async ({ projectId, tokenId }: TokenProps) =>
  apiClient.v6.delete(`/cloud/project/${projectId}/ai/token/${tokenId}`);

export const renewToken = async ({ projectId, tokenId }: TokenProps) =>
  apiClient.v6
    .post(`/cloud/project/${projectId}/ai/token/${tokenId}/renew`)
    .then((res) => res.data as ai.token.Token);
