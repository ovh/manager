export default /* @ngInject */ ($stateProvider, $urlRouterProvider) => {
  $stateProvider.state('app.ip', {
    url: '/ip?serviceName&page&pageSize',
    templateUrl: 'ip/ip.html',
    controller: 'IpMainCtrl',
    controllerAs: '$ctrl',
    reloadOnSearch: false,
    redirectTo: 'app.ip.dashboard',
    resolve: {
      dashboardLink: /* @ngInject */ ($transition$, $state) =>
        $state.href('app.ip.dashboard', $transition$.params()),
      ipLbLink: /* @ngInject */ ($transition$, $state) =>
        $state.href('app.ip.dashboard.iplb', $transition$.params()),
      currentActiveLink: /* @ngInject */ ($transition$, $state) => () =>
        $state.href($state.current.name, $transition$.params()),
      goToOrganisation: /* @ngInject */ ($state) => () =>
        $state.go('app.ip.dashboard.organisation'),
      breadcrumb: /* @ngInject */ ($translate) => $translate.instant('ip_ip'),
    },
  });

  $urlRouterProvider.when(/^\/configuration\/ip/, () => {
    window.location.href = window.location.href.replace('/configuration', '');
  });
};
