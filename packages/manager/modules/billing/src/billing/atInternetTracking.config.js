export default /* @ngInject */ function BillingServicesRun(
  $rootScope,
  atInternet,
  AUTORENEW_EVENT,
  PAYMENT_EVENT,
  OVH_ACCOUNT_EVENT,
  FIDELITY_EVENT,
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

  $rootScope.$on(OVH_ACCOUNT_EVENT.CREDIT, trackClickEvent);
  $rootScope.$on(OVH_ACCOUNT_EVENT.TRANSFER_TO_BANK_ACCOUNT, trackClickEvent);
  $rootScope.$on(OVH_ACCOUNT_EVENT.ALERT, trackClickEvent);
  $rootScope.$on(FIDELITY_EVENT.CREDIT, trackClickEvent);
  $rootScope.$on(
    AUTORENEW_EVENT.DISABLE_AUTOMATIC_PAYMENT_FOR_DOMAINS,
    trackClickEvent,
  );
  $rootScope.$on(AUTORENEW_EVENT.TERMINATE, (event, data) =>
    trackServiceClickEvent(event, data),
  );
  $rootScope.$on(AUTORENEW_EVENT.TERMINATE_AT_EXPIRATION, (event, data) =>
    trackServiceClickEvent(event, data),
  );
  $rootScope.$on(AUTORENEW_EVENT.CANCEL_TERMINATE, (event, data) =>
    trackServiceClickEvent(event, data),
  );
  $rootScope.$on(AUTORENEW_EVENT.ACTIVATE_AUTO_PAYMENT, (event, data) =>
    trackServiceClickEvent(event, data),
  );
  $rootScope.$on(AUTORENEW_EVENT.DEACTIVATE_AUTO_PAYMENT, (event, data) =>
    trackServiceClickEvent(event, data),
  );
  $rootScope.$on(AUTORENEW_EVENT.MODIFY, (event, data) =>
    trackServiceClickEvent(event, data),
  );
  $rootScope.$on(AUTORENEW_EVENT.PAY, (event, data) =>
    trackServiceClickEvent(event, data),
  );

  $rootScope.$on(PAYMENT_EVENT.PAYMENT_MEANS_DISPLAYED, (event, data) => {
    atInternet.trackEvent({
      event: `PaymentMeans-${data.count}`,
      page: 'dedicated::billing::mean',
    });
  });
}
