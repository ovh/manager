angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.alias', {
    url: '/alias/:serviceName',
    views: {
      'telephonyView@telecom.telephony': {
        templateUrl: 'app/telecom/telephony/alias/telecom-telephony-alias.html',
      },
      'aliasView@telecom.telephony.billingAccount.alias': {
        templateUrl:
          'app/telecom/telephony/alias/telecom-telephony-alias-main.view.html',
        controller: 'TelecomTelephonyAliasCtrl',
        controllerAs: '$ctrl',
      },
    },
    translations: { value: ['.'], format: 'json' },
    redirectTo: 'telecom.telephony.billingAccount.alias.dashboard',
    resolve: {
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceName,
    },
  });
});
