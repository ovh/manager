import template from './rsva.html';
import controller from './rsva.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.alias.details.rsva', {
    url: '/rsva',
    views: {
      'aliasInnerView@telecom.telephony.billingAccount.alias.details': {
        template,
        controller,
        controllerAs: '$ctrl',
      },
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('telephony_alias_special_rsva_title'),
    },
  });
};
