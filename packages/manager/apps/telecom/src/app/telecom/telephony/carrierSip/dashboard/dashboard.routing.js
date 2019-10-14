export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.carrierSip', {
    url: '/carrierSip/:serviceName',
    views: {
      'telephonyView@telecom.telephony': 'carrierSipDashboard',
    },
    resolve: {
      billingAccount: /* @ngInject */ $transition$ => $transition$.params().billingAccount,
      billingLink: /* @ngInject */ (
        $state,
        billingAccount,
      ) => $state.href('telecom.telephony.billing.bill', { billingAccount }),
      carrierSip: /* @ngInject */ (
        billingAccount,
        CarrierSipService,
        serviceName,
      ) => CarrierSipService.getCarrierSip(billingAccount, serviceName),
      cdrsLink: /* @ngInject */ (
        $state,
        billingAccount,
        serviceName,
      ) => $state.href('telecom.telephony.carrierSip.cdr', { billingAccount, serviceName }),
      currentActiveLink: /* @ngInject */ ($transition$, $state) => () => $state
        .href($state.current.name, $transition$.params()),
      dashboardLink: /* @ngInject */ (
        $state,
        billingAccount,
        serviceName,
      ) => $state.href('telecom.telephony.carrierSip', { billingAccount, serviceName }),
      endpointsLink: /* @ngInject */ (
        $state,
        billingAccount,
        serviceName,
      ) => $state.href('telecom.telephony.carrierSip.endpoints', { billingAccount, serviceName }),
      serviceInfos: /* @ngInject */ (
        CarrierSipService,
        serviceName,
      ) => CarrierSipService.getServiceInfos(serviceName),
      serviceName: /* @ngInject */ $transition$ => $transition$.params().serviceName,
      settings: /* @ngInject */ (
        billingAccount,
        CarrierSipService,
        serviceName,
      ) => CarrierSipService.getSettings(billingAccount, serviceName),
    },
  });
};
