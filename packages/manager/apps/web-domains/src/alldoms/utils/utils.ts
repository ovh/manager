import { TServiceInfo } from '@/alldoms/types';
import {
  LifecycleActionsEnum,
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
  actions: LifecycleActionsEnum[],
) => actions.includes(LifecycleActionsEnum.TerminateAtExpirationDate);
