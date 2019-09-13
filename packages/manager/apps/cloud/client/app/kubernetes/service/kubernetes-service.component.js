angular.module('managerApp')
  .component('kubernetesService', {
    bindings: {
      serviceName: '@',
    },
    templateUrl: 'app/kubernetes/service/kubernetes-service.html',
    controller: 'KubernetesServiceCtrl',
  });
