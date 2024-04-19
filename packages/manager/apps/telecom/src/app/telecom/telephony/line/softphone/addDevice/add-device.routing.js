export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.dashboard.softphone.add',
    {
      url: '/add',
      views: {
        modal: {
          component: 'softphoneAddDevice',
        },
      },
      resolve: {
        goBack: /* @ngInject */ ($state) => () => $state.go('^'),
      },
      layout: 'modal',
    },
  );
};
