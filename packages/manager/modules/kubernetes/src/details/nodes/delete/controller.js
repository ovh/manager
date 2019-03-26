import get from 'lodash/get';

import { DELETE_CONFIRMATION_INPUT } from './constants';

export default class KubernetesNodesDeleteCtrl {
  /* @ngInject */
  constructor(
    $stateParams, $uibModalInstance,
    Kubernetes, nodeId,
    CUC_FLAVOR_FLAVORTYPE_CATEGORY,
  ) {
    this.$stateParams = $stateParams;
    this.$uibModalInstance = $uibModalInstance;
    this.Kubernetes = Kubernetes;
    this.nodeId = nodeId;
    this.CUC_FLAVOR_FLAVORTYPE_CATEGORY = CUC_FLAVOR_FLAVORTYPE_CATEGORY;
    this.DELETE_CONFIRMATION_INPUT = DELETE_CONFIRMATION_INPUT;
  }

  $onInit() {
    this.loading = false;
    this.serviceName = this.$stateParams.serviceName;
  }

  deleteNode() {
    this.loading = true;
    return this.Kubernetes.deleteNode(this.serviceName, this.nodeId)
      .then(() => this.$uibModalInstance.close())
      .catch(error => this.dismiss(get(error, 'data.message')))
      .finally(() => { this.loading = false; });
  }

  dismiss(error) {
    this.$uibModalInstance.dismiss(error);
  }
}
