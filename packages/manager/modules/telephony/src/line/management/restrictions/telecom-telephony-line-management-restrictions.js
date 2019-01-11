angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.line.restrictions', {
    url: '/restrictions',
    views: {
      'lineView@telecom.telephony.line': {
        templateUrl: 'app/telecom/telephony/line/management/restrictions/telecom-telephony-line-management-restrictions.html',
        controller: 'TelecomTelephonyLineRestrictionsCtrl',
        controllerAs: 'LineRestrictionsCtrl',
      },
    },
    translations: ['.'],
  });
});
