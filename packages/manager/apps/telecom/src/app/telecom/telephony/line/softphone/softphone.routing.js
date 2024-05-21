export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.dashboard.softphone',
    {
      url: '/softphone',
      views: {
        'lineInnerView@telecom.telephony.billingAccount.line.dashboard': {
          component: 'ovhManagerTelecomTelephonyLineSoftphoneComponent',
        },
      },
      resolve: {
        currentServiceIsBeta: /* @ngInject */ (
          SoftphoneService,
          $stateParams,
        ) =>
          SoftphoneService.checkServiceIsBeta(
            $stateParams.billingAccount,
            $stateParams.serviceName,
          ),
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant(
            'telephony_line_phone_actions_line_details_softphone_breadcrumb',
          ),
      },
    },
  );
};
