angular.module('managerApp').controller('KubernetesCtrl', class KubernetesCtrl {
  constructor($scope, $stateParams, Kubernetes, KUBERNETES) {
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.Kubernetes = Kubernetes;
    this.KUBERNETES = KUBERNETES;
  }

  $onInit() {
    this.loading = true;

    this.$scope.$on('changeKubernetesName', (event, displayName) => {
      this.cluster.name = displayName;
    });

    this.getCluster();
  }

  getCluster() {
    return this.Kubernetes.getKubernetesCluster(this.serviceName)
      .then((cluster) => { this.cluster = cluster; })
      .catch((error) => {
        this.cluster = { id: this.serviceName, name: this.serviceName };
        this.errorMessage = _.get(error, 'data.message');
      })
      .finally(() => { this.loading = false; });
  }
});
