import template from './terminate.html';
import controller from './terminate.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.fax.dashboard.management.terminate',
    {
      url: '/terminate',
      views: {
        'faxView@telecom.telephony.billingAccount.fax.dashboard': {
          template,
          controller,
          controllerAs: '$ctrl',
        },
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant(
            'telephony_group_fax_management_terminate_breadcrumb',
          ),
      },
    },
  );
};
