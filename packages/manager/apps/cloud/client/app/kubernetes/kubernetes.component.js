angular.module('managerApp')
  .component('kubernetes', {
    bindings: {
      serviceName: '@',
    },
    templateUrl: 'app/kubernetes/kubernetes.html',
    controller: 'KubernetesCtrl',
  });
