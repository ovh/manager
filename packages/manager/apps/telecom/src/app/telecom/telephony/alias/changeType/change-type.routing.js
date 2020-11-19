import template from './change-type.html';
import controller from './change-type.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.alias.details.configuration.changeType',
    {
      url: '/changeType',
      views: {
        'aliasInnerView@telecom.telephony.billingAccount.alias.details': {
          template,
          controller,
          controllerAs: '$ctrl',
        },
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('telephony_alias_change_type_title'),
      },
    },
  );
};
