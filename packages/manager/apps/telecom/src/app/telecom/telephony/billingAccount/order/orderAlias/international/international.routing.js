import template from './international.html';
import controller from './international.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.orderAlias.international',
    {
      url: '/international',
      views: {
        'telecomTelephonyBillingAccountOrderAliasView@telecom.telephony.billingAccount.orderAlias': {
          template,
          controller,
          controllerAs: 'AliasOrderInternationalCtrl',
        },
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('telephony_order_international_title'),
      },
    },
  );
};
