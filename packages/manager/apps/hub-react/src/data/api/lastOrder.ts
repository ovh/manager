import { aapi } from '@ovh-ux/manager-core-api';
import { LastOrder, LastOrderEnvelope } from '@/types/lastOrder.type';

export const getLastOrder: () => Promise<LastOrder> = async () => {
  const { data } = await aapi.get<LastOrderEnvelope>(`/hub/lastOrder`);
  return data.data?.lastOrder;
};
