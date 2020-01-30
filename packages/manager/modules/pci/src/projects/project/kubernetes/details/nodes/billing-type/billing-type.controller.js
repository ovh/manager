import get from 'lodash/get';

export default class KubernetesNodesBillingTypeCtrl {
  /* @ngInject */
  constructor($translate, Kubernetes) {
    this.$translate = $translate;
    this.Kubernetes = Kubernetes;
  }

  $onInit() {
    this.loading = false;
  }

  switchToMonthlyBilling() {
    this.loading = true;
    return this.Kubernetes.switchToMonthlyBilling(
      this.projectId,
      this.instanceId,
    )
      .then(() =>
        this.goBack(
          this.$translate.instant('kube_nodes_switch_billing_type_success'),
        ),
      )
      .catch((error) =>
        this.goBack(
          this.$translate.instant('kube_nodes_switch_billing_type_error', {
            message: get(error, 'data.message'),
          }),
          'error',
        ),
      )
      .finally(() => {
        this.loading = false;
      });
  }
}
