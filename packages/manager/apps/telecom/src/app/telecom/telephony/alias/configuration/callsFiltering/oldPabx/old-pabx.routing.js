import controller from './old-pabx.controller';
import template from './old-pabx.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.alias.details.configuration.callsFiltering.oldPabx',
    {
      url: '/oldPabx',
      views: {
        'aliasView@telecom.telephony.billingAccount.alias.details': {
          template,
          controller,
          controllerAs: '$ctrl',
        },
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('telephony_line_calls_filtering_oldpabx'),
      },
    },
  );
};
