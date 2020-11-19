import template from './fax.html';
import controller from './fax.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.fax.dashboard.fax', {
    url: '/fax',
    views: {
      'faxInnerView@telecom.telephony.billingAccount.fax.dashboard': {
        template,
        controller,
        controllerAs: '$ctrl',
      },
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('telephony_fax_fax_breadcrumb'),
    },
  });
};
