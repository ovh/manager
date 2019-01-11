angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.alias', {
    url: '/alias/:serviceName',
    views: {
      'telephonyView@telecom.telephony': {
        templateUrl: 'app/telecom/telephony/alias/telecom-telephony-alias.html',
      },
      'aliasView@telecom.telephony.alias': {
        templateUrl: 'app/telecom/telephony/alias/telecom-telephony-alias-main.view.html',
        controller: 'TelecomTelephonyAliasCtrl',
        controllerAs: '$ctrl',
      },
    },
    translations: ['.'],
    redirectTo: 'telecom.telephony.alias.dashboard',
  });
});
