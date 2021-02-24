import template from './consumption.html';
import controller from './consumption.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.fax.dashboard.consumption',
    {
      url: '/consumption',
      views: {
        faxInnerView: {
          template,
          controller,
          controllerAs: '$ctrl',
        },
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('telephony_group_fax_consumption_breadcrumb'),
      },
    },
  );
};
