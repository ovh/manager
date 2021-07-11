import controller from './security.controller';
import template from './security.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('exchange.dashboard.security', {
    url: '/security',
    controller,
    controllerAs: 'ctrl',
    template,
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('exchange_security'),
    },
    onEnter: /* @ngInject */ (trackTab) => trackTab('security'),
    atInternet: {
      ignore: true,
    },
  });
};
