angular
  .module('managerApp')
  .config(($stateProvider) => {
    $stateProvider.state('telecom.telephony.billingAccount.fax.dashboard.fax', {
      url: '/fax',
      views: {
        'faxInnerView@telecom.telephony.billingAccount.fax.dashboard': {
          templateUrl:
            'app/telecom/telephony/fax/fax/telecom-telephony-fax-fax.html',
          controller: 'TelecomTelephonyFaxFaxCtrl',
          controllerAs: '$ctrl',
        },
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('telephony_fax_fax_breadcrumb'),
      },
    });
  })
  .run(/* @ngTranslationsInject:json ./translations */);
