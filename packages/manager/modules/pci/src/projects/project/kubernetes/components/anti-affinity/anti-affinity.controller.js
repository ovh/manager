import has from 'lodash/has';

export default class NodePoolAntiAffinityCtrl {
  onAntiAffinityChange(isAntiAffinity) {
    if (isAntiAffinity) {
      this.nodePool.maxNodes = this.antiAffinityMaxNodes;
    } else if (has(this.nodePool, 'maxNodes')) {
      delete this.nodePool.maxNodes;
    }
  }

  isInvalidAntiAffinity() {
    const { autoscale, nodes } = this.nodePool.autoscaling;

    return (
      (!autoscale && nodes.desired.value > this.antiAffinityMaxNodes) ||
      (autoscale && nodes.highest.value > this.antiAffinityMaxNodes)
    );
  }
}
