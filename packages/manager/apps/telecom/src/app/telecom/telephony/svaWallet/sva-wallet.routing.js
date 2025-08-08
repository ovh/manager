export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.svaWallet', {
    url: '/sva-wallet',
    views: {
      'telephonyView@telecom.telephony': {
        componentProvider: /* @ngInject */ (svaWallet) => {
          if (svaWallet) {
            return 'telephonySvaWalletKycIdentitySummary';
          }
          return 'telephonySvaWalletKycIdentityForm';
        },
      },
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('telephony_billingAccount_svaWallet_kyc_title'),

      companyKinds: /* @ngInject */ (TelephonySvaWalletService) =>
        TelephonySvaWalletService.getCompanyKinds(),

      documentTypeEnum: /* @ngInject */ (meSchema) =>
        meSchema.models['me.sva.document.TypeEnum'].enum,

      documentNatureEnum: /* @ngInject */ (meSchema) =>
        meSchema.models['me.sva.document.NatureEnum'].enum,

      goToBillingAccount: /* @ngInject */ ($state) => () =>
        $state.go('telecom.telephony.billingAccount', {}, { reload: true }),

      saveWalletIban: /* @ngInject */ (TelephonySvaWalletService) => (
        bankAccount,
      ) => TelephonySvaWalletService.saveWalletIban(bankAccount),

      saveWallet: /* @ngInject */ (TelephonySvaWalletService) => (
        wallet,
        bankAccount,
      ) => TelephonySvaWalletService.saveWallet(wallet, bankAccount),

      putWallet: /* @ngInject */ (TelephonySvaWalletService, $state) => (
        wallet,
      ) =>
        TelephonySvaWalletService.putWallet(wallet).then(() => $state.reload()),

      uploadDocument: /* @ngInject */ (TelephonySvaWalletService) => (
        document,
        file,
      ) => TelephonySvaWalletService.uploadDocument(document, file),

      bankAccount: /* @ngInject */ (TelephonySvaWalletService) =>
        TelephonySvaWalletService.getBankAccount(),
    },
  });
};
