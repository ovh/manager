import angular from 'angular';

import nodeComponents from './component';

const moduleName = 'ovhManagerPciProjectKubernetesNodes';

angular.module(moduleName, [])
  .config(/* @ngInject */ ($stateProvider) => {
    $stateProvider
      .state('pci.projects.project.kubernetes.details.nodes', {
        url: '/nodes',
        views: {
          kubernetesView: 'ovhManagerPciProjectKubernetesNodesComponent',
        },
        resolve: {
          breadcrumb: /* @ngInject */ $translate => $translate.instant('kube_nodes'),
        },
      });
  })
  .run(/* @ngTranslationsInject:json ./translations */)
  .component('ovhManagerPciProjectKubernetesNodesComponent', nodeComponents);

export default moduleName;
