angular.module('managerApp')
  .component('kubernetesNodes', {
    bindings: {
      serviceName: '@',
    },
    templateUrl: 'app/kubernetes/nodes/kubernetes-nodes.html',
    controller: 'KubernetesNodesCtrl',
  });
