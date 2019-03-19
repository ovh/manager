angular.module('managerApp')
  .config(($stateProvider) => {
    $stateProvider
      .state('paas.kube.containers', {
        url: '/containers',
        views: {
          kubernetesView: {
            component: 'kubernetesContainers',
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
