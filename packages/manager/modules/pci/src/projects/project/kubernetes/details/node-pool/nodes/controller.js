import find from 'lodash/find';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import set from 'lodash/set';

import { STATUS } from '../../constants';

export default class KubernetesNodesCtrl {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    CucCloudMessage,
    Kubernetes,
    PciProjectFlavors,
    OvhApiCloudProjectKube,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.Kubernetes = Kubernetes;
    this.PciProjectFlavors = PciProjectFlavors;
    this.OvhApiCloudProjectKube = OvhApiCloudProjectKube;
    this.STATUS = STATUS;
  }

  $onInit() {
    this.flavor = null;
    this.formatteFlavor = null;
    this.loadMessages();
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe(
      'pci.projects.project.kubernetes.details.nodepools.details.nodes',
    );
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.projects.project.kubernetes.details.nodepools.details.nodes',
      { onMessage: () => this.refreshMessages() },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  loadRowData(node) {
    return this.getBillingType(node);
  }

  getBillingType(node) {
    return this.Kubernetes.getProjectInstances(this.projectId)
      .then((instances) => {
        const instance = find(instances, (item) => item.id === node.instanceId);
        const monthlyBilling = get(instance, 'monthlyBilling');
        if (isEmpty(monthlyBilling)) {
          set(node, 'billingType', 'hourly');
        } else if (monthlyBilling.status === 'ok') {
          set(node, 'billingType', 'monthly');
        } else {
          set(node, 'billingType', 'monthly_pending');
        }
      })
      .catch(() => {
        this.CucCloudMessage.error(
          this.$translate.instant('kube_nodes_instances_error'),
        );
      });
  }
}
