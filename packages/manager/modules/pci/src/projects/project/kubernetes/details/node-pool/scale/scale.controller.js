import get from 'lodash/get';

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
      .catch((error) =>
        this.goBack(
          this.$translate.instant('kube_node_pool_autoscaling_scale_error', {
            message: get(error, 'data.message'),
          }),
          'error',
        ),
      );
  }

  onNodePoolScaleModalCancel() {
    this.sendKubeTrack('details::nodepools::scale::cancel');
    return this.goBack();
  }
}
