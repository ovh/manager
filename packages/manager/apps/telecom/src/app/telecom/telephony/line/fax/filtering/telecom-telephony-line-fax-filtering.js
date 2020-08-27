angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.dashboard.fax.filtering',
    {
      url: '/filtering',
      views: {
        'lineView@telecom.telephony.billingAccount.line.dashboard': {
          templateUrl:
            'app/telecom/telephony/line/fax/filtering/telecom-telephony-line-fax-filtering.html',
          noTranslations: true,
        },
        'faxFilteringView@telecom.telephony.billingAccount.line.dashboard.fax.filtering': {
          templateUrl:
            'app/telecom/telephony/service/fax/filtering/telecom-telephony-service-fax-filtering.html',
          controller: 'TelecomTelephonyServiceFaxFilteringCtrl',
          controllerAs: '$ctrl',
        },
      },
      translations: {
        value: ['../../../service/fax/filtering'],
        format: 'json',
      },
    },
  );
});
