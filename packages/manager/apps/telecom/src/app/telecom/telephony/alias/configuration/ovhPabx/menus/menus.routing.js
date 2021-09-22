import template from './menus.html';
import controller from './menus.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.alias.details.configuration.ovhPabx.menus',
    {
      url: '/menus',
      views: {
        'aliasView@telecom.telephony.billingAccount.alias.details': {
          template,
          controller,
          controllerAs: '$ctrl',
        },
      },
      params: {
        defaultMenuId: null,
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('telephony_alias_ovh_pabx_menus_breadcrumb'),
        defaultMenuId: /* @ngInject */ ($transition$) =>
          $transition$.params().defaultMenuId,
      },
    },
  );
};
