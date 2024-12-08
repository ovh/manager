import {
  DISABLE_AUTOMATIC_PAYMENT_FOR_DOMAINS,
  TERMINATE,
  TERMINATE_AT_EXPIRATION,
  CANCEL_TERMINATE,
  ACTIVATE_AUTO_PAYMENT,
  DEACTIVATE_AUTO_PAYMENT,
  MODIFY,
  PAY,
} from './constants/autorenewEvent.constants';

import { CREDIT } from './constants/fidelityEvent.constants';

import {
  ALERT,
  CREDIT as CREDIT_EVENT,
  TRANSFER_TO_BANK_ACCOUNT,
} from './constants/ovhAccountEvent.constants';

import { PAYMENT_MEANS_DISPLAYED } from './constants/paymentEvent.constants';

export default /* @ngInject */ function BillingTracking(
  $rootScope,
  atInternet,
) {
  function trackClickEvent(event) {
    return atInternet.trackClick({
      name: event.name,
      type: 'action',
    });
  }

  function trackServiceClickEvent(event, data) {
    const services = Array.isArray(data) ? data : [data];

    services.forEach((s) =>
      atInternet.trackClick({
        name: `${s.serviceType}-${event.name}`,
        type: 'action',
      }),
    );
  }

  $rootScope.$on(CREDIT_EVENT, trackClickEvent);
  $rootScope.$on(TRANSFER_TO_BANK_ACCOUNT, trackClickEvent);
  $rootScope.$on(ALERT, trackClickEvent);
  $rootScope.$on(CREDIT, trackClickEvent);
  $rootScope.$on(DISABLE_AUTOMATIC_PAYMENT_FOR_DOMAINS, trackClickEvent);
  $rootScope.$on(TERMINATE, (event, data) =>
    trackServiceClickEvent(event, data),
  );
  $rootScope.$on(TERMINATE_AT_EXPIRATION, (event, data) =>
    trackServiceClickEvent(event, data),
  );
  $rootScope.$on(CANCEL_TERMINATE, (event, data) =>
    trackServiceClickEvent(event, data),
  );
  $rootScope.$on(ACTIVATE_AUTO_PAYMENT, (event, data) =>
    trackServiceClickEvent(event, data),
  );
  $rootScope.$on(DEACTIVATE_AUTO_PAYMENT, (event, data) =>
    trackServiceClickEvent(event, data),
  );
  $rootScope.$on(MODIFY, (event, data) => trackServiceClickEvent(event, data));
  $rootScope.$on(PAY, (event, data) => trackServiceClickEvent(event, data));

  $rootScope.$on(PAYMENT_MEANS_DISPLAYED, (event, data) => {
    atInternet.trackEvent({
      event: `PaymentMeans-${data.count}`,
      page: 'dedicated::billing::mean',
    });
  });
}
