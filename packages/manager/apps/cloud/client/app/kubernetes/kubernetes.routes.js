angular.module('managerApp')
  .config(($stateProvider) => {
    $stateProvider
      .state('paas.kube', {
        url: '/kube/:serviceName',
        component: 'kubernetes',
        params: { serviceName: null },
        resolve: {
          serviceName: $stateParams => $stateParams.serviceName,
        },
        redirectTo: 'paas.kube.service',
        translations: {
          value: ['.'],
          format: 'json',
        },
      });
  });
