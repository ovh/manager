import template from './informations.html';
import controller from './informations.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.fax.dashboard.management.informations',
    {
      url: '/informations',
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
            'telephony_group_fax_management_informations_main',
          ),
      },
    },
  );
};
