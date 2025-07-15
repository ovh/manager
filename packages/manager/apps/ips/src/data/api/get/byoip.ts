import { ApiResponse, apiClient } from '@ovh-ux/manager-core-api';

export type TokenParam = { campus: string };

export type TokenResponse = string;

export const getTokenQueryKey = (params: TokenParam) => [
  `/me/bringYourOwnIp/token?campus=${encodeURIComponent(params.campus)}`,
];

export const getTokens = async (
  params: TokenParam,
): Promise<ApiResponse<TokenResponse>> =>
  apiClient.v6.get<TokenResponse>(
    `/me/bringYourOwnIp/token?campus=${encodeURIComponent(params.campus)}`,
  );
