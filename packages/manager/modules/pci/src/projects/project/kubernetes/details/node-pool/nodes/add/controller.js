import clone from 'lodash/clone';
import get from 'lodash/get';

export default class KubernetesNodesAddCtrl {
  /* @ngInject */
  constructor($translate, CucCloudMessage, CucFlavorService, Kubernetes) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.CucFlavorService = CucFlavorService;
    this.Kubernetes = Kubernetes;
  }

  $onInit() {
    this.isAdding = false;
    this.loadMessages();

    this.intanceFlavor = {
      ...this.flavor,
      displayedName: this.Kubernetes.formatFlavor(this.flavor),
      quotaOverflow: this.getQuotaOverflow(this.flavor),
    };
    this.flavors = [this.intanceFlavor];
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe(
      'pci.projects.project.kubernetes.details.nodepools.details.nodes.add',
    );
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.projects.project.kubernetes.details.nodepools.details.nodes.add',
      { onMessage: () => this.refreshMessages() },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  getQuotaOverflow(flavor) {
    // addOverQuotaInfos adds 'disabled' key to flavor parameter
    const testedFlavor = clone(flavor);
    this.CucFlavorService.constructor.addOverQuotaInfos(
      testedFlavor,
      this.quotas,
    );
    return get(testedFlavor, 'disabled');
  }

  addNode() {
    this.isAdding = true;
    return this.Kubernetes.resizeNodePool(
      this.projectId,
      this.kubeId,
      this.nodePoolId,
      this.nodeCount + this.nodeAddCount,
    )
      .then(() => {
        return this.nodeCount === 1
          ? this.goBack(this.$translate.instant('kube_nodes_add_success'))
          : this.goBack(
              this.$translate.instant('kube_nodes_add_success_multiple'),
            );
      })
      .catch((error) => {
        this.CucCloudMessage.error(
          this.$translate.instant('kube_nodes_add_error', {
            message: get(error, 'data.message', error.message),
          }),
        );
      })
      .finally(() => {
        this.isAdding = false;
      });
  }
}
