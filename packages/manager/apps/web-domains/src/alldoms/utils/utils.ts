import { TServiceInfo } from '@/alldoms/types';
import { ServiceInfoContactEnum } from '@/alldoms/enum/service.enum';

export const findContact = (
  contacts: TServiceInfo['customer']['contacts'],
  contactType: ServiceInfoContactEnum,
) => {
  const filter = contacts.find((c) => c.type === contactType);
  return filter.customerCode;
};
