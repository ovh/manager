import template from './order-alias.html';
import mainTemplate from './order-alias-main.html';
import controller from './order-alias.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.orderAlias', {
    url: '/orderAlias',
    views: {
      'groupInnerView@telecom.telephony.billingAccount': {
        template,
      },
      'telecomTelephonyBillingAccountOrderAliasView@telecom.telephony.billingAccount.orderAlias': {
        template: mainTemplate,
        controller,
        controllerAs: 'AliasOrderCtrl',
      },
    },
  });
};
