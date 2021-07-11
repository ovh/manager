import template from './domain.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('exchange.dashboard.domain', {
    url: '/domain',
    controller: 'ExchangeTabDomainsCtrl',
    controllerAs: 'ctrl',
    template,
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('exchange_domain'),
    },
    onEnter: /* @ngInject */ (trackTab) => trackTab('domain'),
    atInternet: {
      ignore: true,
    },
  });
};
