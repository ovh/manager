import angular from 'angular';

import kubernetesContainersComponent from './kubernetes-containers.component';

const moduleName = 'ovhManagerKubernetesContainers';

angular.module(moduleName, [])
  .config(/* @ngInject */ ($stateProvider) => {
    $stateProvider
      .state('kube.containers', {
        url: '/containers',
        views: {
          kubernetesView: 'ovhManagerKubernetesContainersComponent',
        },
        resolve: {
          serviceName: $stateParams => $stateParams.serviceName,
        },
        translations: {
          value: ['..'],
          format: 'json',
        },
      });
  })
  .component('ovhManagerKubernetesContainersComponent', kubernetesContainersComponent);

export default moduleName;
