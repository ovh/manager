import controller from './dedicated-housing.controller';
import template from './dedicated-housing.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dedicated-housing.dashboard', {
    url: '/:productId',
    template,
    controller,
    resolve: {
      name: /* @ngInject */ ($transition$) => $transition$.params().productId,

      dashboardLink: /* @ngInject */ ($transition$, $state) =>
        $state.href('dedicated-housing.dashboard', $transition$.params()),
      backupLink: /* @ngInject */ ($transition$, $state) =>
        $state.href(
          'dedicated-housing.dashboard.backup',
          $transition$.params(),
        ),
      taskLink: /* @ngInject */ ($transition$, $state) =>
        $state.href('dedicated-housing.dashboard.task', $transition$.params()),
      currentActiveLink: /* @ngInject */ ($transition$, $state) => () =>
        $state.href($state.current.name, $transition$.params()),

      breadcrumb: /* @ngInject */ (name) => name,
    },
  });
};
