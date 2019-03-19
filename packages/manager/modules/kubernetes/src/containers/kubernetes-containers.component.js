angular.module('managerApp')
  .component('kubernetesContainers', {
    bindings: {
      serviceName: '@',
    },
    templateUrl: 'app/kubernetes/containers/kubernetes-containers.html',
    controller: 'KubernetesContainersCtrl',
  });
