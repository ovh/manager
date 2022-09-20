import get from 'lodash/get';

import { NODE_POOL_NAME_REGEX } from './add.constants';
import { NAME_INPUT_CONSTRAINTS } from '../../../kubernetes.constants';

export default class {
  /* @ngInject */
  constructor($translate, CucCloudMessage, Kubernetes) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.Kubernetes = Kubernetes;
    this.inputConstraints = NAME_INPUT_CONSTRAINTS;
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

    const { flavor, name, antiAffinity } = this.nodePool;
    const { monthlyBilling: monthlyBilled, autoscaling } = this.nodePool;
    const { autoscale, nodes } = autoscaling;
    const { lowest, desired, highest } = nodes;
    const options = {
      flavorName: flavor.name,
      name,
      antiAffinity,
      monthlyBilled,
      autoscale,
      minNodes: lowest.value,
      desiredNodes: autoscale ? lowest.value : desired.value,
      maxNodes: highest.value,
    };

    this.isAdding = true;
    return this.Kubernetes.createNodePool(this.projectId, this.kubeId, options)
      .then(() =>
        this.goBack(
          this.$translate.instant('kube_add_node_pool_success', {
            nodePoolName: this.nodePool.name,
          }),
          'success',
        ),
      )
      .catch((error) => {
        const errorId = this.getKubeApiErrorId(error);
        let errorMessage = this.$translate.instant('kube_add_node_pool_error', {
          message: error.data?.message,
          nodePoolName: this.nodePool.name,
        });
        if (errorId) {
          const translateMessage = this.$translate.instant(
            `kube_add_node_pool_error_${errorId}`,
          );
          errorMessage = {
            textHtml: `${translateMessage} <a class="oui-link_icon" href="${this.getQuotaBuildUrl()}">${this.$translate.instant(
              'kube_add_node_pool_error_quota_link',
            )} <span class="oui-icon oui-icon-external-link" aria-hidden="true"></span></a>`,
          };
        }
        this.CucCloudMessage.error(errorMessage);
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

  isBillingWarningMessageDisplayed() {
    return this.nodePool.monthlyBilling && this.nodePool.autoscaling.autoscale;
  }
}
