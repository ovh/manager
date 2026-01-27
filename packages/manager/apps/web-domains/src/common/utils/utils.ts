import { TServiceInfo } from '@/common/types/common.types';
import { ServiceInfoContactEnum } from '@/common/enum/common.enum';


export const findContact = (
  contacts: TServiceInfo['customer']['contacts'],
  contactType: ServiceInfoContactEnum,
) => {
  const contact = contacts.find((c) => c.type === contactType);
  return contact ? contact.customerCode : null;
};
