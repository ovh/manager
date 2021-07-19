export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.svaWallet', {
    url: '/sva-wallet',
    views: {
      'telephonyView@telecom.telephony': {
        component: 'telephonySvaWalletKycIdenityForm',
      },
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant(
          'telephony_billingAccount_svaWallet_kycIdentityForm_title',
        ),
    },
  });
};
