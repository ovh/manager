import template from './cdn-dedicated-manage.html';
import controller from './cdn-dedicated-manage.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.networks.cdn.dedicated.manage', {
    redirectTo: 'app.networks.cdn.dedicated.manage.statistics',
    views: {
      cdnMainView: {
        template,
        controller,
        controllerAs: '$ctrl',
      },
    },
    resolve: {
      domainsLink: /* @ngInject */ ($transition$, $state) =>
        $state.href(
          'app.networks.cdn.dedicated.manage.domain',
          $transition$.params(),
        ),
      currentActiveLink: /* @ngInject */ ($transition$, $state) => () =>
        $state.href($state.current.name, $transition$.params()),
      breadcrumb: () => null,
    },
  });
};
