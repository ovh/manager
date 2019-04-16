import angular from 'angular';

import kubernetesContainersComponent from './component';

const moduleName = 'ovhManagerPciProjectKubernetesContainers';

angular.module(moduleName, [])
  .config(/* @ngInject */ ($stateProvider) => {
    $stateProvider
      .state('pci.projects.project.kubernetes.details.containers', {
        url: '/containers',
        views: {
          kubernetesView: 'ovhManagerPciProjectKubernetesContainersComponent',
        },
        resolve: {
          serviceName: $stateParams => $stateParams.serviceName,
        },
      });
  })
  .run(/* @ngTranslationsInject:json ./translations */)
  .component('ovhManagerPciProjectKubernetesContainersComponent', kubernetesContainersComponent);

export default moduleName;
