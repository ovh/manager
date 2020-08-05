angular
  .module('managerApp')
  .config(($stateProvider) => {
    $stateProvider.state(
      'telecom.telephony.billingAccount.line.dashboard.restrictions',
      {
        url: '/restrictions',
        views: {
          'lineView@telecom.telephony.billingAccount.line.dashboard': {
            templateUrl:
              'app/telecom/telephony/line/management/restrictions/telecom-telephony-line-management-restrictions.html',
            controller: 'TelecomTelephonyLineRestrictionsCtrl',
            controllerAs: 'LineRestrictionsCtrl',
          },
        },
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant('telephony_line_restrictions_title'),
        },
      },
    );
  })
  .run(/* @ngTranslationsInject:json ./translations */);
