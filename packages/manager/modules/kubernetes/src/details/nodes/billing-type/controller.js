import get from 'lodash/get';

export default class KubernetesNodesDeleteCtrl {
  /* @ngInject */
  constructor(
    $uibModalInstance,
    Kubernetes, instanceId, nodeName, projectId,
    CUC_FLAVOR_FLAVORTYPE_CATEGORY,
  ) {
    this.$uibModalInstance = $uibModalInstance;
    this.Kubernetes = Kubernetes;
    this.nodeName = nodeName;
    this.instanceId = instanceId;
    this.projectId = projectId;
    this.CUC_FLAVOR_FLAVORTYPE_CATEGORY = CUC_FLAVOR_FLAVORTYPE_CATEGORY;
  }

  $onInit() {
    this.loading = false;
  }

  switchToMonthlyBilling() {
    this.loading = true;
    return this.Kubernetes.switchToMonthlyBilling(this.projectId, this.instanceId)
      .then(() => this.$uibModalInstance.close())
      .catch(error => this.dismiss(get(error, 'data.message')))
      .finally(() => { this.loading = false; });
  }

  dismiss(error) {
    this.$uibModalInstance.dismiss(error);
  }
}
