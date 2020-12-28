import template from './filtering.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.fax.fax.filtering', {
    url: '/filtering',
    views: {
      'telephonyView@telecom.telephony': {
        template,
        noTranslations: true,
      },
      'faxFilteringView@telecom.telephony.billingAccount.fax.fax.filtering': {
        templateUrl:
          'app/telecom/telephony/service/fax/filtering/filtering.html',
        controller: 'TelecomTelephonyServiceFaxFilteringCtrl',
        controllerAs: '$ctrl',
      },
    },
  });
};
