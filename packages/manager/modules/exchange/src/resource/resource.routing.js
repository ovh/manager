import template from './resource.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('exchange.dashboard.resource', {
    url: '/resource',
    controller: 'ExchangeTabResourcesCtrl',
    controllerAs: 'ctrl',
    template,
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('exchange_resource'),
    },
    onEnter: /* @ngInject */ (trackTab) => trackTab('resource'),
    atInternet: {
      ignore: true,
    },
  });
};
