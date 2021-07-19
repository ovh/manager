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
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('telephony_alias_portability_order_title'),
      canOrderSpecialPortability: /* @ngInject */ (isSvaWalletValid) =>
        isSvaWalletValid,
    },
  });
};
