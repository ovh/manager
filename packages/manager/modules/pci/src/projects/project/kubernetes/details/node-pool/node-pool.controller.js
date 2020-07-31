import find from 'lodash/find';
import set from 'lodash/set';

export default class KubernetesNodePoolsCtrl {
  /* @ngInject */
  constructor(
    $translate,
    CucCloudMessage,
    Kubernetes,
    PciProjectFlavors,
  ) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.Kubernetes = Kubernetes;
    this.PciProjectFlavors = PciProjectFlavors;
  }

  $onInit() {
    this.loadMessages();
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe(
      'pci.projects.project.kubernetes.details.nodepools',
    );
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.projects.project.kubernetes.details.nodepools',
      { onMessage: () => this.refreshMessages() },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  getAssociatedFlavor(nodePool) {
    return this.PciProjectFlavors
      .getFlavors(this.projectId, this.cluster.region)
      .then((flavors) => {
        this.flavor = find(flavors, { name: nodePool.flavor });
        this.flavor.region = this.cluster.region;
        this.formatteFlavor = this.Kubernetes.formatFlavor(this.flavor);
        set(
          nodePool,
          'formattedFlavor',
          this.formatteFlavor,
        );
        return nodePool;
      })
      .catch(() => {
        set(
          nodePool,
          'formattedFlavor',
          this.$translate.instant('kube_nodes_flavor_error'),
        );
      });
  }

  loadRowData(nodePool) {
    return this.getAssociatedFlavor(nodePool);
  }
}
