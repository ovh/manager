import { ServiceInfoContactEnum } from '@/alldoms/enum/service.enum';
import { TServiceInfo } from '@/alldoms/types';

export const findContact = (
  contacts: TServiceInfo['customer']['contacts'],
  contactType: ServiceInfoContactEnum,
) => {
  const contact = contacts.find((c) => c.type === contactType);
  return contact ? contact.customerCode : null;
};
