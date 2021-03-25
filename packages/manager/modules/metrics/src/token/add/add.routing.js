import controller from './metrics-token-add.controller';
import template from './metrics-token-add.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('metrics.detail.token.add', {
    url: '/add',
    views: {
      metricsContent: {
        template,
        controller,
        controllerAs: '$ctrl',
      },
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('metrics_token_add_token'),
    },
  });
};
