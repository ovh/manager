import { ApiResponse, apiClient } from '@ovh-ux/manager-core-api';
import { IpTask } from '@/types';

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

export type AggregateResponse = {
  aggregationIp: string;
  childrenIps: string[];
}[];

export const getAggregate = (ip: string) =>
  apiClient.v6.get<AggregateResponse>(
    `/ip/${encodeURIComponent(ip)}/bringYourOwnIp/aggregate`,
  );

export const postAggregate = ({
  ip,
  aggregationIp,
}: {
  ip: string;
  aggregationIp: string;
}) =>
  apiClient.v6.post<IpTask>(
    `/ip/${encodeURIComponent(ip)}/bringYourOwnIp/aggregate`,
    {
      aggregationIp,
    },
  );

export type SliceResponse = {
  slicingSize: number;
  childrenIps: string[];
}[];

export const getSlice = (ip: string) =>
  apiClient.v6.get<SliceResponse>(
    `/ip/${encodeURIComponent(ip)}/bringYourOwnIp/slice`,
  );

export const postSlice = ({
  ip,
  slicingSize,
}: {
  ip: string;
  slicingSize: number;
}) =>
  apiClient.v6.post<IpTask>(
    `/ip/${encodeURIComponent(ip)}/bringYourOwnIp/slice`,
    {
      slicingSize,
    },
  );
