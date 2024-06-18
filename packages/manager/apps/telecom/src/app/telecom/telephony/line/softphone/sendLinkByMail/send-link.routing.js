export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.dashboard.softphone.mail',
    {
      url: '/mail',
      views: {
        modal: {
          component: 'softphoneSendLinkByMail',
        },
      },
      layout: 'modal',
      params: {
        deviceId: null,
      },
      resolve: {
        currentUserEmail: /* @ngInject */ (coreConfig) =>
          coreConfig.getUser().email,
        goBack: /* @ngInject */ ($state) => () => $state.go('^'),
        goToSoftphoneDashboard: /* @ngInject */ ($state) => (params) =>
          $state.go(
            'telecom.telephony.billingAccount.line.dashboard.softphone',
            params,
            { reload: true },
          ),
        breadcrumb: () => null,
      },
    },
  );
};
