angular
  .module('managerApp')
  .config(($stateProvider) => {
    $stateProvider.state(
      'telecom.telephony.billingAccount.fax.dashboard.consumption',
      {
        url: '/consumption',
        views: {
          faxInnerView: {
            templateUrl:
              'app/telecom/telephony/fax/consumption/telecom-telephony-fax-consumption.html',
            controller: 'TelecomTelephonyFaxConsumptionCtrl',
            controllerAs: '$ctrl',
          },
        },
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant('telephony_group_fax_consumption_breadcrumb'),
        },
      },
    );
  })
  .run(/* @ngTranslationsInject:json ./translations */);
