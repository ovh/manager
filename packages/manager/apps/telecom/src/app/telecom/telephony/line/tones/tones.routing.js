import template from './tones.html';
import controller from './tones.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.line.tones', {
    url: '/tones',
    views: {
      'lineInnerView@telecom.telephony.billingAccount.line': {
        template,
        controller,
        controllerAs: 'LineTonesCtrl',
      },
    },
  });
};
