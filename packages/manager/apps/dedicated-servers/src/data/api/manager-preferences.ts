import { apiClient, ApiResponse } from '@ovh-ux/manager-core-api';
import { ViewType } from '@/components/manageView/types';

export type PostManagerPreferencesParams = {
  key: string;
  value: string;
};

export type GetManagerPreferencesResponse = {
  key: string;
  value: string;
};

export const getManagerPreferencesQueryKey = (key?: string) =>
  key
    ? ['/me/preferences/manager', `/me/preferences/manager/${key}`]
    : ['/me/preferences/manager'];

export const getManagerPreferences = (key?: string): Promise<ViewType[]> =>
  apiClient.v6
    .get<GetManagerPreferencesResponse>(
      `/me/preferences/manager${key ? `/${encodeURIComponent(key)}` : ''}`,
    )
    .then(({ data }) => {
      return data?.value ? JSON.parse(data.value) : [];
    });

export const postManagerPreferences = (
  params: PostManagerPreferencesParams,
): Promise<ApiResponse<void>> =>
  apiClient.v6.post(`/me/preferences/manager`, {
    key: params.key,
    value: params.value,
  });

export type PutManagerPreferencesParams = {
  key: string;
  value: string;
};

export const putManagerPreferences = (
  params: PutManagerPreferencesParams,
): Promise<ApiResponse<void>> =>
  apiClient.v6.put(`/me/preferences/manager/${params.key}`, {
    value: params.value,
  });
