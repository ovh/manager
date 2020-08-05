angular
  .module('managerApp')
  .config(($stateProvider) => {
    $stateProvider.state(
      'telecom.telephony.billingAccount.line.dashboard.offerChange',
      {
        url: '/offerChange',
        views: {
          'lineView@telecom.telephony.billingAccount.line.dashboard': {
            templateUrl:
              'app/telecom/telephony/line/management/offerChange/telecom-telephony-line-management-offer-change.html',
            controller: 'TelecomTelephonyLineManagementOfferChangeCtrl',
            controllerAs: 'OfferChangeCtrl',
          },
        },
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant('telephony_line_management_change_offer_title'),
        },
      },
    );
  })
  .run(/* @ngTranslationsInject:json ./translations */);
