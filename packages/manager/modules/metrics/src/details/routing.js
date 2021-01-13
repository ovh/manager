import MetricsDashboardCtrl from '../dashboard/metrics-dashboard.controller';
import MetricsDetailCtrl from './metrics-detail.controller';
import MetricsHeaderCtrl from '../header/metrics-header.controller';
import MetricsPlatformCtrl from '../platform/metrics-platform.controller';
import MetricsTokenCtrl from '../token/metrics-token.controller';
import MetricsTokenAddCtrl from '../token/add/metrics-token-add.controller';

import dashboardTemplate from '../dashboard/metrics-dashboard.html';
import detailTemplate from './metrics-detail.html';
import headerTemplate from '../header/metrics-header.html';
import platformTemplate from '../platform/metrics-platform.html';
import tokenTemplate from '../token/metrics-token.html';
import tokenAddTemplate from '../token/add/metrics-token-add.html';

export default /* @ngInject */ ($stateProvider) => {
  const metricsHeader = {
    template: headerTemplate,
    controller: MetricsHeaderCtrl,
    controllerAs: 'MetricsHeaderCtrl',
  };

  $stateProvider
    .state('metrics.detail', {
      url: '/{serviceName}',
      views: {
        metricsContainer: {
          template: detailTemplate,
          controller: MetricsDetailCtrl,
          controllerAs: 'MetricsDetailCtrl',
        },
      },
      translations: {
        value: ['.'],
        format: 'json',
      },
    })
    .state('metrics.detail.dashboard', {
      url: '/dashboard',
      views: {
        metricsHeader,
        metricsContent: {
          template: dashboardTemplate,
          controller: MetricsDashboardCtrl,
          controllerAs: '$ctrl',
        },
      },
      translations: {
        value: ['.', './dashboard', './token'],
        format: 'json',
      },
    })
    .state('metrics.detail.token', {
      url: '/token',
      redirectTo: 'metrics.detail.token.home',
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
    .state('metrics.detail.token.home', {
      url: '/',
      views: {
        metricsContent: {
          template: tokenTemplate,
          controller: MetricsTokenCtrl,
          controllerAs: 'MetricsTokenCtrl',
        },
      },
      translations: {
        value: ['.', './token'],
        format: 'json',
      },
    })
    .state('metrics.detail.token.add', {
      url: '/add',
      views: {
        metricsContent: {
          template: tokenAddTemplate,
          controller: MetricsTokenAddCtrl,
          controllerAs: '$ctrl',
        },
      },
      translations: {
        value: ['.', './token', './token/add'],
        format: 'json',
      },
    })
    .state('metrics.detail.platform', {
      url: '/platform',
      views: {
        metricsHeader,
        metricsContent: {
          template: platformTemplate,
          controller: MetricsPlatformCtrl,
          controllerAs: 'MetricsPlatformCtrl',
        },
      },
      translations: {
        value: ['.', './platform'],
        format: 'json',
      },
    });
};
