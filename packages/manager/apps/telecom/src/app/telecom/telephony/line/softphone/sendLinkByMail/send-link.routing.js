export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.dashboard.softphone.mail',
    {
      url: '/mail/:deviceId',
      views: {
        modal: {
          component: 'softphoneSendLinkByMail',
        },
      },
      layout: 'modal',
      resolve: {
        currentUserEmail: /* @ngInject */ (coreConfig) =>
          coreConfig.getUser().then((me) => me.email),
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
