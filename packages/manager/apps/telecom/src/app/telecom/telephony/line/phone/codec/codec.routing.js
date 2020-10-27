import template from './codec.html';
import controller from './codec.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.line.phone.codec', {
    url: '/codec',
    views: {
      'lineView@telecom.telephony.billingAccount.line': {
        template,
        controller,
        controllerAs: 'CodecCtrl',
      },
    },
  });
};
