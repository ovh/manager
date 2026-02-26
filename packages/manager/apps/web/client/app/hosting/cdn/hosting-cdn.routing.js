import template from './hosting-cdn.html';
import controller from './hosting-cdn.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.hosting.dashboard.cdn', {
    url: '/cdn',
    redirectTo: 'app.hosting.dashboard.cdn.logs',
    views: {
      '@app.hosting.dashboard': {
        template,
        controller,
        controllerAs: '$ctrl',
      },
    },
    resolve: {
      breadcrumb: () => 'CDN',
    },
  });
};
