import { TServiceInfo } from '@/alldoms/types';
import {
  LifecycleCapacitiesEnum,
  ServiceInfoContactEnum,
} from '@/alldoms/enum/service.enum';

export const findContact = (
  contacts: TServiceInfo['customer']['contacts'],
  contactType: ServiceInfoContactEnum,
) => {
  const contact = contacts.find((c) => c.type === contactType);
  return contact ? contact.customerCode : null;
};

export const hasTerminateAtExpirationDateAction = (
  actions: LifecycleCapacitiesEnum[],
) => actions.includes(LifecycleCapacitiesEnum.TerminateAtExpirationDate);
