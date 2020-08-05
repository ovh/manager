export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.dashboard.phone.order',
    {
      url: '/order',
      views: {
        'lineView@telecom.telephony.billingAccount.line.dashboard': 'order',
      },
      resolve: {
        goBack: /* @ngInject */ ($state) => () =>
          $state.go('telecom.telephony.billingAccount.line.dashboard.phone'),
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('telephony_line_phone_order_title'),
      },
    },
  );
};
