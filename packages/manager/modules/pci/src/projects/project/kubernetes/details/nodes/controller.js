import find from 'lodash/find';
import set from 'lodash/set';

import { STATUS } from '../constants';

export default class KubernetesNodesCtrl {
  /* @ngInject */
  constructor(
    $state,
    CucCloudMessage,
    Kubernetes,
    OvhApiCloudProjectFlavor,
    OvhApiCloudProjectKube,
  ) {
    this.$state = $state;
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
}
