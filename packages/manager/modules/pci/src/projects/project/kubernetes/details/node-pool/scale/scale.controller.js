export default class KubernetesNodePoolsScaleCtrl {
  /* @ngInject */
  constructor($translate, Kubernetes) {
    this.$translate = $translate;
    this.Kubernetes = Kubernetes;
  }

  $onInit() {
    const { autoscale } = this.nodePool;
    const { lowest, desired, highest } = this.autoscaling.nodes;

    this.isScaling = false;
    this.autoscaling.autoscale = autoscale;
    lowest.value = this.nodePool.minNodes;
    desired.value = this.nodePool.desiredNodes;
    highest.value = this.nodePool.maxNodes;
  }

  onNodePoolScaleModalValidate() {
    this.sendKubeTrack('details::nodepools::scale::confirm');

    this.isScaling = true;
    const { nodes, autoscale } = this.autoscaling;
    const { lowest, desired, highest } = nodes;
    const { antiAffinity } = this.nodePool;

    return this.Kubernetes.resizeNodePool(
      this.projectId,
      this.kubeId,
      this.nodePoolId,
      {
        autoscale,
        minNodes: antiAffinity && !autoscale ? lowest.min : lowest.value,
        desiredNodes: autoscale ? lowest.value : desired.value,
        maxNodes: highest.value,
      },
    )
      .then(() =>
        this.goBack(
          this.$translate.instant('kube_node_pool_autoscaling_scale_success'),
        ),
      )
      .catch((error) => {
        const errorId = this.getKubeApiErrorId(error);
        let errorMessage = this.$translate.instant(
          'kube_node_pool_autoscaling_scale_error',
          {
            message: error.data?.message,
          },
        );
        if (errorId) {
          const translateMessage = this.$translate.instant(
            `kube_node_pool_autoscaling_scale_error_${errorId}`,
          );
          errorMessage = {
            textHtml: `${translateMessage} <a class="oui-link_icon" href="${this.getQuotaBuildUrl()}">${this.$translate.instant(
              'kube_node_pool_autoscaling_scale_error_quota_link',
            )} <span class="oui-icon oui-icon-external-link" aria-hidden="true"></span></a>`,
          };
        }
        this.CucCloudMessage.error(errorMessage);
      });
  }

  onNodePoolScaleModalCancel() {
    this.sendKubeTrack('details::nodepools::scale::cancel');
    return this.goBack();
  }
}
