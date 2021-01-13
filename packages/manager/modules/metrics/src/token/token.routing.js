import controller from './metrics-token.controller';
import template from './metrics-token.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('metrics.detail.token', {
    url: '/token',
    views: {
      metricsContent: {
        template,
        controller,
        controllerAs: 'MetricsTokenCtrl',
      },
    },
  });
};
