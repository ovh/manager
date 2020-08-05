export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.dashboard.phone.accessories',
    {
      url: '/accessories',
      views: {
        'lineView@telecom.telephony.billingAccount.line.dashboard':
          'accessories',
      },
      resolve: {
        goBack: /* @ngInject */ ($state) => () =>
          $state.go('telecom.telephony.billingAccount.line.dashboard.phone'),
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('telephony_line_phone_accessories_title'),
      },
    },
  );
};
