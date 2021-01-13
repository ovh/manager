import controller from './metrics-platform.controller';
import template from './metrics-platform.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('metrics.detail.platform', {
    url: '/platform',
    views: {
      metricsContent: {
        template,
        controller,
        controllerAs: 'MetricsPlatformCtrl',
      },
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('metrics_platform_title'),
    },
  });
};
