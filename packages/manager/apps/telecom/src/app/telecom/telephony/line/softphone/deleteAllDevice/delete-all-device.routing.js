export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.dashboard.softphone.delete-all',
    {
      url: '/delete-all',
      views: {
        modal: {
          component: 'softphoneDeleteAllDevice',
        },
      },
      layout: 'modal',
      resolve: {
        goBack: /* @ngInject */ ($state) => (reload) =>
          $state.go('^', {}, { reload }),
        breadcrumb: () => null,
        billingAccount: /* @ngInject */ ($stateParams) =>
          $stateParams.billingAccount,
        serviceName: /* @ngInject */ ($stateParams) => $stateParams.serviceName,
      },
    },
  );
};
