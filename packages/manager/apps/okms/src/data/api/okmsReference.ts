import apiClient from '@ovh-ux/manager-core-api';
import { OkmsServiceKeyReference } from '@/types/okmsServiceKeyReference.type';

export const getServiceKeyReference = async (
  okmsRegion: string,
): Promise<{
  data: OkmsServiceKeyReference[];
}> => {
  return apiClient.v2.get(`okms/reference/serviceKey?region=${okmsRegion}`);
};

export const getOkmsServiceKeyReferenceQueryKey = (okmsRegion: string) => [
  `get/resource/serviceKey/${okmsRegion}`,
];
