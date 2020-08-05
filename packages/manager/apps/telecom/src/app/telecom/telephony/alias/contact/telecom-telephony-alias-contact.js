angular
  .module('managerApp')
  .config(($stateProvider) => {
    $stateProvider.state(
      'telecom.telephony.billingAccount.alias.details.contact',
      {
        url: '/contact',
        views: {
          'aliasInnerView@telecom.telephony.billingAccount.alias.details': {
            templateUrl:
              'app/telecom/telephony/service/contact/telecom-telephony-service-contact.html',
            controller: 'TelecomTelephonyServiceContactCtrl',
            controllerAs: 'ServiceContactCtrl',
          },
        },
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant('telephony_alias_contact_breadcrumb'),
        },
        translations: { value: ['../../service/contact'], format: 'json' },
      },
    );
  })
  .run(/* @ngTranslationsInject:json ./translations */);
