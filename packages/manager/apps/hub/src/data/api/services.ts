import { aapi } from '@ovh-ux/manager-core-api';
import { ServicesEnvelope, ProductList } from '@/types/services.type';
import { ApiEnvelope } from '@/types/apiEnvelope.type';

export const getServices: () => Promise<
  ApiEnvelope<ProductList>
> = async () => {
  const { data } = await aapi.get<ServicesEnvelope>(`/hub/services`);
  return data.data?.services;
};
