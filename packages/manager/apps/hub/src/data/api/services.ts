import { aapi } from '@ovh-ux/manager-core-api';
import { ServicesEnvelope, Services } from '@/types/services.type';

export const getServices: () => Promise<Services> = async () => {
  const { data } = await aapi.get<ServicesEnvelope>(`/hub/services`);
  return data.data?.services;
};
