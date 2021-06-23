import controller from './ip.controller';
import template from './ip.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.ip', {
    url: '/ip?serviceName&page&pageSize',
    template,
    controller,
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
};
