import apiClient from '@ovh-ux/manager-core-api';
import { Secret } from '@secret-manager/types/secret.type';

export const secretListQueryKey = (okmsId: string) => [
  'secrets',
  'list',
  okmsId,
];

export const getSecretList = async (okmsId: string) => {
  const { data } = await apiClient.v2.get<Secret[]>(
    `okms/resource/${okmsId}/secret`,
  );
  return data;
};
