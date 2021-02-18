import controller from './alias.controller';
import templateMain from './alias.main.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.alias', {
    url: '/alias',
    template: '<div ui-view></div>',
    redirectTo: 'telecom.telephony.billingAccount.services',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('telephony_alias_breadcrumb'),
    },
  });

  $stateProvider.state('telecom.telephony.billingAccount.alias.details', {
    url: '/:serviceName',
    views: {
      'telephonyView@telecom.telephony': {
        template: '<div ui-view="aliasView"></div>',
      },
      'aliasView@telecom.telephony.billingAccount.alias.details': {
        template: templateMain,
        controller,
        controllerAs: '$ctrl',
      },
    },
    redirectTo: 'telecom.telephony.billingAccount.alias.details.dashboard',
    resolve: {
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceName,
      breadcrumb: /* @ngInject */ (serviceName) => serviceName,
    },
  });
};
