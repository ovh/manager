import find from 'lodash/find';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import set from 'lodash/set';

import { STATUS } from '../constants';

export default class KubernetesNodesCtrl {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    CucCloudMessage,
    Kubernetes,
    OvhApiCloudProjectFlavor,
    OvhApiCloudProjectKube,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.Kubernetes = Kubernetes;
    this.OvhApiCloudProjectFlavor = OvhApiCloudProjectFlavor;
    this.OvhApiCloudProjectKube = OvhApiCloudProjectKube;
    this.STATUS = STATUS;
  }

  $onInit() {
    this.loadMessages();
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe('pci.projects.project.kubernetes.details.nodes');
    this.messageHandler = this.CucCloudMessage.subscribe('pci.projects.project.kubernetes.details.nodes', { onMessage: () => this.refreshMessages() });
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  getAssociatedFlavor(node) {
    return this.OvhApiCloudProjectFlavor
      .v6()
      .query({ serviceName: this.projectId, region: this.cluster.region })
      .$promise
      .then((flavors) => {
        set(node, 'formattedFlavor', this.Kubernetes.formatFlavor(
          find(flavors, { name: node.flavor }),
        ));
      })
      .catch(() => {
        set(node, 'formattedFlavor', this.$translate.instant('kube_nodes_flavor_error'));
      });
  }

  loadRowData(node) {
    return this.$q.all([
      this.getAssociatedFlavor(node),
      this.getBillingType(node),
    ]);
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
        this.CucCloudMessage.error(this.$translate.instant('kube_nodes_instances_error'));
      });
  }
}
