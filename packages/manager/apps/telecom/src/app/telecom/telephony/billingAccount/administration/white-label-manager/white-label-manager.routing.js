export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.administration.whiteLabelManager',
    {
      url: '/white-label-manager',
      views: {
        'groupView@telecom.telephony.billingAccount': {
          component: 'whiteLabelManagerComponent',
        },
      },
      resolve: {
        goBackUrl: /* @ngInject */ ($state) =>
          $state.href('telecom.telephony.billingAccount.administration'),
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('telephony_white_label_manager_title'),
      },
      atInternet: {
        rename:
          'telecom::telephony::billingAccount::administration::whiteLabel',
      },
    },
  );
};
