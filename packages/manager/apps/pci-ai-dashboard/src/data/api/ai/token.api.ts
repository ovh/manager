import { apiClient } from '@ovh-ux/manager-core-api';
import { ai } from '@/types/ai';
import { PCIAi } from '..';

export const getTokens = async ({ projectId }: PCIAi) =>
  apiClient.v6
    .get(`/cloud/project/${projectId}/ai/token`, {
      headers: {
        'X-Pagination-Mode': 'CachedObjectList-Pages',
        'X-Pagination-Size': '50000',
        Pragma: 'no-cache',
      },
    })
    .then((res) => res.data as ai.token.Token[]);

export interface AddTokenProps extends PCIAi {
  token: ai.token.TokenSpec;
}
export const addToken = async ({ projectId, token }: AddTokenProps) =>
  apiClient.v6
    .post(`/cloud/project/${projectId}/ai/token`, token)
    .then((res) => res.data as ai.token.Token);

export interface TokenProps extends PCIAi {
  tokenId: string;
}
export const deleteToken = async ({ projectId, tokenId }: TokenProps) =>
  apiClient.v6.delete(`/cloud/project/${projectId}/ai/token/${tokenId}`);

export const renewToken = async ({ projectId, tokenId }: TokenProps) =>
  apiClient.v6
    .post(`/cloud/project/${projectId}/ai/token/${tokenId}/renew`)
    .then((res) => res.data as ai.token.Token);
