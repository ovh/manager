import template from './cdn-dedicated.html';
import controller from './cdn-dedicated.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.networks.cdn.dedicated', {
    url: '/:productId',
    redirectTo: 'app.networks.cdn.dedicated.manage',
    views: {
      '': {
        template,
        controller,
      },
    },
    resolve: {
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().productId,
      breadcrumb: /* @ngInject */ (serviceName) => serviceName,
    },
  });
};
