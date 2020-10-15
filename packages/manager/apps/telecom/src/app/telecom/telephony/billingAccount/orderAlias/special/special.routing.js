import template from './special.html';
import controller from './special.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.orderAlias.special', {
    url: '/special',
    views: {
      'telecomTelephonyBillingAccountOrderAliasView@telecom.telephony.billingAccount.orderAlias': {
        template,
        controller,
        controllerAs: 'AliasOrderSpecialCtrl',
      },
    },
  });
};
