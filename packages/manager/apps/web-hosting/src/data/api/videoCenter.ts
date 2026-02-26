import { v2 } from '@ovh-ux/manager-core-api';

import {
  AuthToken,
  PublicService,
  tokenPayload,
} from '../types/product/videoManagerCenter/publicService';

export const getServiceVideoCenter = async (serviceId: string) => {
  const { data } = await v2.get<PublicService>(`/videocenter/resource/${serviceId}`);
  return data;
};

export const generateVideoCenterToken = async (
  serviceId: string,
  payload: tokenPayload,
): Promise<string> => {
  const { data } = await v2.post<AuthToken>(
    `/videocenter/resource/${serviceId}/auth/token`,
    payload,
  );
  return data?.token ?? '';
};
