import angular from 'angular';

import nodeComponents from './component';

const moduleName = 'ovhManagerKubernetesNodes';

angular.module(moduleName, [])
  .config(/* @ngInject */ ($stateProvider) => {
    $stateProvider
      .state('kube.nodes', {
        url: '/nodes',
        views: {
          kubernetesView: 'ovhManagerKubernetesNodesComponent',
        },
        resolve: {
          serviceName: $stateParams => $stateParams.serviceName,
        },
      });
  })
  .run(/* @ngTranslationsInject:json ./translations */)
  .component('ovhManagerKubernetesNodesComponent', nodeComponents);

export default moduleName;
