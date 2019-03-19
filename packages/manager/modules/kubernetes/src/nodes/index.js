import angular from 'angular';

import nodeComponents from './kubernetes-nodes.component';

const moduleName = 'ovhManagerKubernetesNodes';

angular.module(moduleName, [])
  .config(($stateProvider) => {
    $stateProvider
      .state('kube.nodes', {
        url: '/nodes',
        views: {
          kubernetesView: 'ovhManagerKubernetesNodesComponent',
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
  .component('ovhManagerKubernetesNodesComponent', nodeComponents);

export default moduleName;
