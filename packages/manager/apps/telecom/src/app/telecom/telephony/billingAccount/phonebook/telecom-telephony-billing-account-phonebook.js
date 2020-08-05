angular
  .module('managerApp')
  .config(($stateProvider) => {
    $stateProvider.state('telecom.telephony.billingAccount.phonebook', {
      url: '/phonebook',
      views: {
        'groupInnerView@telecom.telephony.billingAccount': {
          templateUrl:
            'app/telecom/telephony/billingAccount/phonebook/telecom-telephony-billing-account-phonebook.html',
          controller: 'TelecomTelephonyBillingAccountPhonebookCtrl',
          controllerAs: 'PhonebookCtrl',
        },
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('telecom_telephony_phonebook'),
      },
      translations: { value: ['..'], format: 'json' },
    });
  })
  .run(/* @ngTranslationsInject:json ./translations */);
