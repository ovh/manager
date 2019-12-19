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
          breadcrumb: /* @ngInject */ ($translate) => $translate.instant('kube_containers_and_services'),
        },
      });
  })
  .run(/* @ngTranslationsInject:json ./translations */)
  .component('ovhManagerPciProjectKubernetesContainersComponent', kubernetesContainersComponent);

export default moduleName;
