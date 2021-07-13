import template from './cdn-dedicated-domain.html';
import controller from './cdn-dedicated-domain.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.networks.cdn.dedicated.manage.domain.dashboard', {
    redirectTo: 'app.networks.cdn.dedicated.manage.domain.dashboard.statistics',
    url: '/:domain',
    views: {
      'cdnMainView@app.networks.cdn.dedicated': {
        template,
        controller,
        controllerAs: '$ctrl',
      },
    },
    resolve: {
      domain: /* @ngInject */ ($transition$) => $transition$.params().domain,
      breadcrumb: /* @ngInject */ (domain) => domain,
    },
  });
};
