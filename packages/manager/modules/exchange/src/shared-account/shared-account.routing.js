import template from './shared-account.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('exchange.dashboard.shared-account', {
    url: '/shared-account',
    controller: 'ExchangeTabSharedAccountsCtrl',
    controllerAs: 'ctrl',
    template,
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('exchange_dashboard_shared_account'),
    },
    onEnter: /* @ngInject */ (trackTab) => trackTab('shared-account'),
    atInternet: {
      ignore: true,
    },
  });
};
