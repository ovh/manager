import controller from './metrics-detail.controller';
import template from './metrics-detail.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('metrics.detail', {
    url: '/{serviceName}',
    redirectTo: 'metrics.detail.dashboard',
    views: {
      metricsContainer: {
        template,
        controller,
        controllerAs: 'MetricsDetailCtrl',
      },
    },
    resolve: {
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceName,
      breadcrumb: /* @ngInject */ (serviceName) => serviceName,
    },
  });
};
