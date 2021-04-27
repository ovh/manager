import clone from 'lodash/clone';
import find from 'lodash/find';
import get from 'lodash/get';
import set from 'lodash/set';

export default class KubernetesNodesAddCtrl {
  /* @ngInject */
  constructor($translate, CucCloudMessage, Kubernetes) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
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

  static addOverQuotaInfos(flavor, quota, minDisk = 0, minRam = 0) {
    const quotaByRegion = find(quota, { region: flavor.region });
    const instanceQuota = get(quotaByRegion, 'instance', false);
    if (instanceQuota) {
      // set over quota reason
      if (
        instanceQuota.maxInstances !== -1 &&
        instanceQuota.usedInstances >= instanceQuota.maxInstances
      ) {
        set(flavor, 'disabled', 'QUOTA_INSTANCE');
      } else if (
        flavor.ram &&
        instanceQuota.maxRam !== -1 &&
        flavor.ram > instanceQuota.maxRam - instanceQuota.usedRAM
      ) {
        set(flavor, 'disabled', 'QUOTA_RAM');
      } else if (
        flavor.vcpus &&
        instanceQuota.maxCores !== -1 &&
        flavor.vcpus > instanceQuota.maxCores - instanceQuota.usedCores
      ) {
        set(flavor, 'disabled', 'QUOTA_VCPUS');
      }

      // set max instances (-1 : unlimited)
      if (instanceQuota.maxInstances === -1) {
        set(flavor, 'maxInstance', -1);
      } else {
        set(
          flavor,
          'maxInstance',
          instanceQuota.maxInstances - instanceQuota.usedInstances,
        );
      }

      if (instanceQuota.maxRam === -1) {
        set(flavor, 'maxInstance', Math.max(flavor.maxInstance, -1));
      } else {
        set(
          flavor,
          'maxInstance',
          Math.min(
            flavor.maxInstance > -1 ? flavor.maxInstance : 1000,
            Math.floor(
              (instanceQuota.maxRam - instanceQuota.usedRAM) / flavor.ram,
            ),
          ),
        );
      }

      if (instanceQuota.maxCores === -1) {
        set(flavor, 'maxInstance', Math.max(flavor.maxInstance, -1));
      } else {
        set(
          flavor,
          'maxInstance',
          Math.min(
            flavor.maxInstance > -1 ? flavor.maxInstance : 1000,
            Math.floor(
              (instanceQuota.maxCores - instanceQuota.usedCores) / flavor.vcpus,
            ),
          ),
        );
      }
    }

    if (minDisk > flavor.disk && !flavor.disabled) {
      set(flavor, 'disabled', 'QUOTA_MINDISK');
    }

    if (minRam > flavor.ram && !flavor.disabled) {
      set(flavor, 'disabled', 'QUOTA_MINRAM');
    }
  }

  getQuotaOverflow(flavor) {
    // addOverQuotaInfos adds 'disabled' key to flavor parameter
    const testedFlavor = clone(flavor);
    this.constructor.addOverQuotaInfos(testedFlavor, this.quotas);
    return get(testedFlavor, 'disabled');
  }

  addNode() {
    this.sendKubeTrack('details::nodepools::details::nodes::add::confirm');

    this.isAdding = true;
    return this.Kubernetes.resizeNodePool(
      this.projectId,
      this.kubeId,
      this.nodePoolId,
      {
        desiredNodes: this.nodeCount + this.nodeAddCount,
        autoscale: this.autoscaling.autoscale,
        minNodes: this.autoscaling.nodes.lowest.value,
        maxNodes: this.autoscaling.nodes.highest.value,
      },
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

  onAddNodeCancel() {
    this.sendKubeTrack('details::nodepools::details::nodes::add::cancel');
    this.goBack();
  }

  onNodePoolAutoscalingFocus() {
    this.displayNodePoolSizing = true;
    this.autoscaling.nodes.lowest.value = this.nodeAddCount;
  }
}
