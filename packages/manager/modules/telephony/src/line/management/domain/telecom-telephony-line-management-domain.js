angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.line.domain', {
    url: '/domain',
    views: {
      'lineView@telecom.telephony.line': {
        templateUrl: 'app/telecom/telephony/line/management/domain/telecom-telephony-line-management-domain.html',
        controller: 'TelecomTelephonyLineDomainCtrl',
        controllerAs: 'DomainCtrl',
      },
    },
    translations: ['.'],
  });
});
