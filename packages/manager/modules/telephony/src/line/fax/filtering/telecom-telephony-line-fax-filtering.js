angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.line.fax.filtering', {
    url: '/filtering',
    views: {
      'lineView@telecom.telephony.line': {
        templateUrl: 'app/telecom/telephony/line/fax/filtering/telecom-telephony-line-fax-filtering.html',
        noTranslations: true,
      },
      'faxFilteringView@telecom.telephony.line.fax.filtering': {
        templateUrl: 'app/telecom/telephony/service/fax/filtering/telecom-telephony-service-fax-filtering.html',
        controller: 'TelecomTelephonyServiceFaxFilteringCtrl',
        controllerAs: '$ctrl',
      },
    },
    translations: ['../../../service/fax/filtering'],
  });
});
