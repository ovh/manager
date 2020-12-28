import template from './filtering.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.line.fax.filtering', {
    url: '/filtering',
    views: {
      'lineView@telecom.telephony.billingAccount.line': {
        template,
        noTranslations: true,
      },
      'faxFilteringView@telecom.telephony.billingAccount.line.fax.filtering': {
        templateUrl:
          'app/telecom/telephony/service/fax/filtering/filtering.html',
        controller: 'TelecomTelephonyServiceFaxFilteringCtrl',
        controllerAs: '$ctrl',
      },
    },
  });
};
