import template from './details.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.line.phone.details', {
    url: '/details',
    views: {
      'lineView@telecom.telephony.billingAccount.line': {
        template,
      },
      'detailsView@telecom.telephony.billingAccount.line.phone.details': {
        templateUrl: 'app/telecom/telephony/line/details/details.html',
        controller: 'TelecomTelephonyLineDetailsCtrl',
        controllerAs: '$ctrl',
      },
    },
  });
};
