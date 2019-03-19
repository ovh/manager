import get from 'lodash/get';

export default class KubernetesCtrl {
  /* @ngInject */
  constructor($scope, Kubernetes, KUBERNETES) {
    this.$scope = $scope;
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
        this.errorMessage = get(error, 'data.message');
      })
      .finally(() => { this.loading = false; });
  }
}
