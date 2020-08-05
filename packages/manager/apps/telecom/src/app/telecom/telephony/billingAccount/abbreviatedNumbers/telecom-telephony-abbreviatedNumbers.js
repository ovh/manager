angular
  .module('managerApp')
  .config(($stateProvider) => {
    $stateProvider.state(
      'telecom.telephony.billingAccount.abbreviatedNumbers',
      {
        url: '/abbreviatedNumbers',
        views: {
          'groupInnerView@telecom.telephony.billingAccount': {
            templateUrl:
              'app/telecom/telephony/billingAccount/abbreviatedNumbers/telecom-telephony-abbreviatedNumbers.html',
            controller: 'TelecomTelephonyAbbreviatedNumbersCtrl',
            controllerAs: 'AbbreviatedNumbersCtrl',
          },
        },
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant('telephony_abbreviated_numbers_title'),
        },
        translations: { value: ['..'], format: 'json' },
      },
    );
  })
  .run(/* @ngTranslationsInject:json ./translations */);
