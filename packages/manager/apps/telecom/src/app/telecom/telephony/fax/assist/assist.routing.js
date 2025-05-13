import template from './assist.html';
import controller from './assist.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.fax.dashboard.assist',
    {
      url: '/assist',
      views: {
        faxInnerView: {
          template,
          controller,
          controllerAs: '$ctrl',
        },
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('telephony_group_fax_assist_breadcrumb'),
      },
    },
  );
};
