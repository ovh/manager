import controller from './add.controller';
import template from './add.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.alias.details.configuration.lines.add',
    {
      url: '/add',
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
            'telephony_alias_config_contactCenterSolution_lines_add',
          ),
      },
      translations: { value: ['..'], format: 'json' },
    },
  );
};
