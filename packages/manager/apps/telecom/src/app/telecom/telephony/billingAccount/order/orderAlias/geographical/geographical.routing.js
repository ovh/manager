import template from './geographical.html';
import controller from './geographical.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.orderAlias.geographical',
    {
      url: '/geographical',
      views: {
        'telecomTelephonyBillingAccountOrderAliasView@telecom.telephony.billingAccount.orderAlias': {
          template,
          controller,
          controllerAs: 'AliasOrderGeographicalCtrl',
        },
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('telephony_order_geographical_title'),
      },
    },
  );
};
