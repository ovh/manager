import { aapi } from '@ovh-ux/manager-core-api';

import { ApiEnvelope } from '@/types/apiEnvelope.type';
import { ProductList, ServicesEnvelope } from '@/types/services.type';

export const getServices: () => Promise<ApiEnvelope<ProductList>> = async () => {
  const { data } = await aapi.get<ServicesEnvelope>(`/hub/services`);
  return data.data?.services;
};
