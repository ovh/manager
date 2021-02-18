import template from './easy-pabx.html';
import controller from './easy-pabx.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.alias.details.configuration.mode.easyPabx',
    {
      url: '/easyPabx',
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
            'telephony_alias_configuration_mode_easy_pabx_no_reply_timer',
          ),
      },
    },
  );
};
