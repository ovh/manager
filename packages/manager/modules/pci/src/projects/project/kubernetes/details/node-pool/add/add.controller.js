import get from 'lodash/get';

import { NODE_POOL_NAME_REGEX } from './add.constants';

export default class {
  /* @ngInject */
  constructor($translate, CucCloudMessage, Kubernetes, OvhApiCloudProjectKube) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.Kubernetes = Kubernetes;
    this.OvhApiCloudProjectKube = OvhApiCloudProjectKube;
  }

  $onInit() {
    this.NODE_POOL_NAME_REGEX = NODE_POOL_NAME_REGEX;
    this.isAdding = false;
    this.nodePool = {
      antiAffinity: false,
      name: null,
      flavor: null,
      monthlyBilling: false,
      autoscaling: this.autoscaling,
    };
    this.loadMessages();
    this.loadFlavors(this.region.name);
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe(
      'pci.projects.project.kubernetes.details.nodepools.add',
    );
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.projects.project.kubernetes.details.nodepools.add',
      { onMessage: () => this.refreshMessages() },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  create() {
    this.sendKubeTrack('details::nodepools::add::confirm');

    this.isAdding = true;
    return this.Kubernetes.createNodePool(this.projectId, this.kubeId, {
      flavorName: this.nodePool.flavor.name,
      name: this.nodePool.name,
      antiAffinity: this.nodePool.antiAffinity,
      monthlyBilled: this.nodePool.monthlyBilling,
      autoscale: this.nodePool.autoscaling.autoscale,
      minNodes: this.nodePool.autoscaling.nodes.lowest.value,
      desiredNodes: this.nodePool.autoscaling.nodes.desired.value,
      maxNodes: this.nodePool.autoscaling.nodes.highest.value,
    })
      .then(() =>
        this.goBack(
          this.$translate.instant('kube_add_node_pool_success', {
            nodePoolName: this.nodePool.name,
          }),
          'success',
        ),
      )
      .catch((error) => {
        this.CucCloudMessage.error(
          this.$translate.instant('kube_add_node_pool_error', {
            nodePoolName: this.nodePool.name,
            message: get(error, 'data.message', error.message),
          }),
        );
      })
      .finally(() => {
        this.isAdding = false;
      });
  }

  loadFlavors(region) {
    this.loadingFlavors = true;
    this.Kubernetes.getAvailableFlavors(region, this.projectId, this.kubeId)
      .then((flavors) => {
        this.flavors = flavors;
      })
      .catch((error) => {
        this.CucCloudMessage.error(
          this.$translate.instant('kube_common_flavor_load_error', {
            message: get(error, 'data.message'),
          }),
        );
      })
      .finally(() => {
        this.loadingFlavors = false;
      });
  }

  onNodePoolSubmit() {
    this.displaySelectedFlavor = true;
    if (
      this.nodePool.autoscaling.nodes.desired.value > this.antiAffinityMaxNodes
    ) {
      this.nodePool.antiAffinity = false;
    }
  }

  onNodePoolAddModalCancel() {
    this.sendKubeTrack('details::nodepools::add::cancel');
    this.goBack();
  }
}
