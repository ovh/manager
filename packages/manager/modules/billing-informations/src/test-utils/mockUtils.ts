import { add, format } from 'date-fns';

import { ServiceDetails, defaultServiceResponse } from '@ovh-ux/manager-module-common-api';

export const serviceSuspendedResponse: ServiceDetails = JSON.parse(
  JSON.stringify(defaultServiceResponse),
) as ServiceDetails;
serviceSuspendedResponse.billing.lifecycle.current.state = 'terminated';

export const serviceEngagedAndEndResponse: ServiceDetails = JSON.parse(
  JSON.stringify(defaultServiceResponse),
) as ServiceDetails;
serviceEngagedAndEndResponse.billing.engagement = {
  endDate: format(add(new Date(), { months: 1 }), 'yyyy-MM-dd'),
  endRule: {
    possibleStrategies: [],
    strategy: 'CANCEL_SERVICE',
  },
};

export const serviceEngagedAndContinueResponse: ServiceDetails = JSON.parse(
  JSON.stringify(defaultServiceResponse),
) as ServiceDetails;
serviceEngagedAndContinueResponse.billing.engagement = {
  endDate: format(add(new Date(), { months: 1 }), 'yyyy-MM-dd'),
  endRule: {
    possibleStrategies: [],
    strategy: 'REACTIVATE_ENGAGEMENT',
  },
};

export const serviceManualRenewResponse: ServiceDetails = JSON.parse(
  JSON.stringify(defaultServiceResponse),
) as ServiceDetails;
serviceManualRenewResponse.billing.renew.current.mode = 'manual';
