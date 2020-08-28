angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.fax.dashboard.fax.filtering',
    {
      url: '/filtering',
      views: {
        'telephonyView@telecom.telephony': {
          templateUrl:
            'app/telecom/telephony/fax/fax/filtering/telecom-telephony-fax-fax-filtering.html',
          noTranslations: true,
        },
        'faxFilteringView@telecom.telephony.billingAccount.fax.dashboard.fax.filtering': {
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
