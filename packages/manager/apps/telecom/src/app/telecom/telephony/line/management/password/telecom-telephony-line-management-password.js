angular
  .module('managerApp')
  .config(($stateProvider) => {
    $stateProvider.state(
      'telecom.telephony.billingAccount.line.dashboard.password',
      {
        url: '/password',
        views: {
          'lineView@telecom.telephony.billingAccount.line.dashboard': {
            templateUrl:
              'app/telecom/telephony/line/management/password/telecom-telephony-line-management-password.html',
            controller: 'TelecomTelephonyLinePasswordCtrl',
            controllerAs: 'PasswordCtrl',
          },
        },
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant('telephony_line_password_title'),
        },
      },
    );
  })
  .run(/* @ngTranslationsInject:json ./translations */);
