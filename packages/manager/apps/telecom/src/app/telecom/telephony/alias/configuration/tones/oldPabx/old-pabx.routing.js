import template from './old-pabx.html';
import controller from './old-pabx.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.alias.details.configuration.tones.oldPabx',
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
          $translate.instant(
            'telephony_alias_configuration_tones_old_pabx_sub_title',
          ),
      },
    },
  );
};
