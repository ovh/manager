import get from 'lodash/get';

export default class KubernetesNodesDeleteCtrl {
  /* @ngInject */
  constructor(
    $stateParams, $uibModalInstance,
    Kubernetes, nodeId,
    CLOUD_FLAVORTYPE_CATEGORY, KUBERNETES,
  ) {
    this.$stateParams = $stateParams;
    this.$uibModalInstance = $uibModalInstance;
    this.Kubernetes = Kubernetes;
    this.nodeId = nodeId;
    this.CLOUD_FLAVORTYPE_CATEGORY = CLOUD_FLAVORTYPE_CATEGORY;
    this.KUBERNETES = KUBERNETES;
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
