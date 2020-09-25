export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.networks.cdn.dedicated', {
    url: '/:productId',
    redirectTo: 'app.networks.cdn.dedicated.manage',
    views: {
      '': {
        templateUrl: 'cdn/dedicated/cdn-dedicated.html',
        controller: 'CdnCtrl',
      },
    },
    resolve: {
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().productId,
      breadcrumb: /* @ngInject */ (serviceName) => serviceName,
    },
  });
};
