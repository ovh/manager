import get from 'lodash/get';

export default class KubernetesNodePoolsScaleCtrl {
  /* @ngInject */
  constructor($translate, Kubernetes, coreURLBuilder) {
    this.$translate = $translate;
    this.Kubernetes = Kubernetes;
    this.coreURLBuilder = coreURLBuilder;
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
        if (get(error, 'data.status') === 412) {
          this.goBack({
            textHtml: this.$translate.instant(
              `kube_node_pool_autoscaling_scale_error_${get(
                error,
                'data.message',
              ).slice(
                get(error, 'data.message').indexOf('[') + 1,
                get(error, 'data.message').indexOf(']'),
              )}`,
              {
                quotaUrl: this.coreURLBuilder.buildURL(
                  'public-cloud',
                  `#/pci/projects/${this.projectId}/quota`,
                ),
              },
            ),
            type: 'error',
          });
        } else {
          this.goBack(
            this.$translate.instant('kube_node_pool_autoscaling_scale_error', {
              message: get(error, 'data.message'),
            }),
            'error',
          );
        }
      });
  }

  onNodePoolScaleModalCancel() {
    this.sendKubeTrack('details::nodepools::scale::cancel');
    return this.goBack();
  }
}
