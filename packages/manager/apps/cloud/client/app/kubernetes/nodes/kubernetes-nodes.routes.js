angular.module('managerApp')
  .config(($stateProvider) => {
    $stateProvider
      .state('paas.kube.nodes', {
        url: '/nodes',
        views: {
          kubernetesView: {
            component: 'kubernetesNodes',
          },
        },
        resolve: {
          serviceName: $stateParams => $stateParams.serviceName,
        },
        translations: {
          value: ['..'],
          format: 'json',
        },
      });
  });
