import template from './order.html';
import controller from './order.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.portabilityOrder', {
    url: '/portabilityOrder',
    views: {
      'telephonyView@telecom.telephony': {
        template,
        controller,
        controllerAs: 'PortabilityOrderCtrl',
      },
    },
  });
};
