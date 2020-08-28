export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.carrierSip.dashboard',
    {
      url: '/:serviceName',
      views: {
        'telephonyView@telecom.telephony': 'carrierSipDashboard',
      },
      resolve: {
        billingAccount: /* @ngInject */ ($transition$) =>
          $transition$.params().billingAccount,
        billingLink: /* @ngInject */ ($state, billingAccount) =>
          $state.href('telecom.telephony.billingAccount.billing.bill', {
            billingAccount,
          }),
        carrierSip: /* @ngInject */ (
          billingAccount,
          CarrierSipService,
          serviceName,
        ) => CarrierSipService.getCarrierSip(billingAccount, serviceName),
        cdrsLink: /* @ngInject */ ($state, billingAccount, serviceName) =>
          $state.href(
            'telecom.telephony.billingAccount.carrierSip.dashboard.cdr',
            {
              billingAccount,
              serviceName,
            },
          ),
        clusterDetails: /* @ngInject */ (
          $http,
          $q,
          billingAccount,
          serviceName,
        ) =>
          $http
            .get(
              `/telephony/${billingAccount}/carrierSip/${serviceName}/clusterDetails`,
            )
            .then(({ data }) => data)
            .catch((error) =>
              [404, 500].includes(error.status) ? {} : $q.reject(error),
            ),
        currentActiveLink: /* @ngInject */ ($transition$, $state) => () =>
          $state.href($state.current.name, $transition$.params()),
        dashboardLink: /* @ngInject */ ($state, billingAccount, serviceName) =>
          $state.href('telecom.telephony.billingAccount.carrierSip.dashboard', {
            billingAccount,
            serviceName,
          }),
        endpointsLink: /* @ngInject */ ($state, billingAccount, serviceName) =>
          $state.href(
            'telecom.telephony.billingAccount.carrierSip.dashboard.endpoints',
            {
              billingAccount,
              serviceName,
            },
          ),
        serviceInfos: /* @ngInject */ (CarrierSipService, serviceName) =>
          CarrierSipService.getServiceInfos(serviceName),
        serviceName: /* @ngInject */ ($transition$) =>
          $transition$.params().serviceName,
        settings: /* @ngInject */ (
          billingAccount,
          CarrierSipService,
          serviceName,
        ) => CarrierSipService.getSettings(billingAccount, serviceName),
        breadcrumb: /* @ngInject */ (serviceName) => serviceName,
      },
    },
  );
};
