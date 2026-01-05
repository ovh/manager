import { v2 } from '@ovh-ux/manager-core-api';

import { PublicService } from '../types/product/videoManagerCenter/publicService';

export const getServiceVideoCenter = async (serviceId: string) => {
  const { data } = await v2.get<PublicService>(`/videocenter/resource/${serviceId}`);
  return data;
};
