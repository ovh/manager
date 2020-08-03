angular.module('managerApp').config(($stateProvider) => {
  const metricsHeader = {
    templateUrl: 'app/dbaas/dbaas-metrics/header/metrics-header.html',
    controller: 'MetricsHeaderCtrl',
    controllerAs: 'MetricsHeaderCtrl',
  };

  $stateProvider
    .state('dbaas.metrics.detail', {
      url: '/{serviceName}',
      views: {
        metricsContainer: {
          templateUrl: 'app/dbaas/dbaas-metrics/metrics-detail.html',
          controller: 'MetricsDetailCtrl',
          controllerAs: 'MetricsDetailCtrl',
        },
      },
      translations: {
        value: ['.'],
        format: 'json',
      },
    })
    .state('dbaas.metrics.detail.dashboard', {
      url: '/dashboard',
      views: {
        metricsHeader,
        metricsContent: {
          templateUrl:
            'app/dbaas/dbaas-metrics/dashboard/metrics-dashboard.html',
          controller: 'MetricsDashboardCtrl',
          controllerAs: '$ctrl',
        },
      },
      translations: {
        value: ['.', './dashboard', './token'],
        format: 'json',
      },
    })
    .state('dbaas.metrics.detail.token', {
      url: '/token',
      redirectTo: 'dbaas.metrics.detail.token.home',
      views: {
        metricsHeader,
        metricsContent: {
          template: `
                        <div data-ui-view="metricsContent"></div>
                    `,
        },
      },
      translations: {
        value: ['.', './token'],
        format: 'json',
      },
    })
    .state('dbaas.metrics.detail.token.home', {
      url: '/',
      views: {
        metricsContent: {
          templateUrl: 'app/dbaas/dbaas-metrics/token/metrics-token.html',
          controller: 'MetricsTokenCtrl',
          controllerAs: 'MetricsTokenCtrl',
        },
      },
      translations: {
        value: ['.', './token'],
        format: 'json',
      },
    })
    .state('dbaas.metrics.detail.token.add', {
      url: '/add',
      views: {
        metricsContent: {
          templateUrl:
            'app/dbaas/dbaas-metrics/token/add/metrics-token-add.html',
          controller: 'MetricsTokenAddCtrl',
          controllerAs: '$ctrl',
        },
      },
      translations: {
        value: ['.', './token', './token/add'],
        format: 'json',
      },
    })
    .state('dbaas.metrics.detail.platform', {
      url: '/platform',
      views: {
        metricsHeader,
        metricsContent: {
          templateUrl: 'app/dbaas/dbaas-metrics/platform/metrics-platform.html',
          controller: 'MetricsPlatformCtrl',
          controllerAs: 'MetricsPlatformCtrl',
        },
      },
      translations: {
        value: ['.', './platform'],
        format: 'json',
      },
    });
});
