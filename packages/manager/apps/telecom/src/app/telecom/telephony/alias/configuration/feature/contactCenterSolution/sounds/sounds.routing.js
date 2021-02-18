import controller from './sounds.controller';
import template from './sounds.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.alias.details.configuration.sounds',
    {
      url: '/sounds',
      views: {
        'aliasInnerView@telecom.telephony.billingAccount.alias.details': {
          template,
          controller,
          controllerAs: '$ctrl',
        },
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant(
            'telephony_alias_config_contactCenterSolution_sounds',
          ),
      },
    },
  );
};
