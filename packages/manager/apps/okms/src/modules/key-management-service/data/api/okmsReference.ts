import { OkmsServiceKeyReference } from '@key-management-service/types/okmsServiceKeyReference.type';

import apiClient from '@ovh-ux/manager-core-api';

export const getServiceKeyReference = async (
  okmsRegion: string,
): Promise<OkmsServiceKeyReference[]> => {
  const { data } = await apiClient.v2.get<OkmsServiceKeyReference[]>(
    `okms/reference/serviceKey?region=${okmsRegion}`,
  );
  return data;
};

export const getOkmsServiceKeyReferenceQueryKey = (okmsRegion: string) => [
  `get/resource/serviceKey/${okmsRegion}`,
];
