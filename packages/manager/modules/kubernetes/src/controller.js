import get from 'lodash/get';

import { DOC_URL } from './constants';

export default class KubernetesCtrl {
  /* @ngInject */
  constructor($scope, Kubernetes) {
    this.$scope = $scope;
    this.Kubernetes = Kubernetes;
  }

  $onInit() {
    this.loading = true;

    this.DOC_URL = DOC_URL;

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
