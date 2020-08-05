angular
  .module('managerApp')
  .config(($stateProvider) => {
    $stateProvider.state(
      'telecom.telephony.billingAccount.fax.dashboard.assist',
      {
        url: '/assist',
        views: {
          faxInnerView: {
            templateUrl:
              'app/telecom/telephony/fax/assist/telecom-telephony-fax-assist.html',
            controller: 'TelecomTelephonyFaxAssistCtrl',
            controllerAs: '$ctrl',
          },
        },
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant('telephony_group_fax_assist_breadcrumb'),
        },
        translations: { value: ['../../service/assist'], format: 'json' },
      },
    );
  })
  .run(/* @ngTranslationsInject:json ./translations */);
