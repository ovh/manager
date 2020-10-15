import template from './details-offer.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.line.detailsOffer', {
    url: '/detailsOffer',
    views: {
      'lineView@telecom.telephony.billingAccount.line': {
        template,
      },
      'detailsView@telecom.telephony.billingAccount.line.detailsOffer': {
        templateUrl: 'app/telecom/telephony/line/details/details.html',
        controller: 'TelecomTelephonyLineDetailsCtrl',
        controllerAs: '$ctrl',
      },
    },
  });
};
