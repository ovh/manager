import template from './diagnostic.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('exchange.dashboard.diagnostic', {
    url: '/diagnostic',
    controller: 'ExchangeTabDiagnosticsCtrl',
    controllerAs: 'ctrl',
    template,
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('exchange_diagnostic'),
    },
    onEnter: /* @ngInject */ (trackTab) => trackTab('diagnostic'),
    atInternet: {
      ignore: true,
    },
  });
};
