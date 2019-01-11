angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.line.mgcpIpRestriction', {
    url: '/mgcpIpRestriction',
    views: {
      'lineView@telecom.telephony.line': {
        templateUrl: 'app/telecom/telephony/line/management/mgcpIpRestriction/telecom-telephony-line-mgcpIpRestriction.html',
        controller: 'TelecomTelephonyLineMgcpIpRestrictionCtrl',
        controllerAs: 'MgcpIpRestrictionCtrl',
      },
    },
    translations: ['.'],
  });
});
