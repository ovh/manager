import { ServiceDetails } from '@ovh-ux/manager-react-components';

import { ZimbraPlanCodes } from '../type';
import { ServiceBillingState, SlotService } from './type';

export const getServiceBillingState = (service: ServiceDetails) => {
  switch (true) {
    case service.billing?.lifecycle.current.state !== 'active':
      return ServiceBillingState.CANCELED;
    case service.billing?.lifecycle.current.pendingActions.includes('terminateAtExpirationDate'):
      return ServiceBillingState.CANCELATION_PLANNED;
    case service.billing?.renew.current.mode === 'automatic':
      return ServiceBillingState.AUTOMATIC_RENEWAL;
    case service.billing?.renew.current.mode === 'manual':
      return ServiceBillingState.MANUAL_RENEWAL;
    default:
      return ServiceBillingState.UNHANDLED;
  }
};

export const makeSlotService = (service: ServiceDetails): SlotService => {
  return {
    id: service.serviceId,
    nextBillingDate: service.billing?.nextBillingDate,
    state: getServiceBillingState(service),
    planCode: service.billing.plan.code as ZimbraPlanCodes,
  };
};

export const makeSlotServiceHashmap = (services: ServiceDetails[]) => {
  return services.reduce(
    (acc, curr) => {
      const slotId = curr.route?.vars?.find((item) => item.key === 'slotId')?.value;
      if (slotId) {
        acc[slotId] = makeSlotService(curr);
      }
      return acc;
    },
    {} as Record<string, SlotService>,
  );
};
