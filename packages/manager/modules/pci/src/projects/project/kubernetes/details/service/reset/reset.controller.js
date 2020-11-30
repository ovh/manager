import get from 'lodash/get';

import { RESET_CONFIRMATION_INPUT, WORKER_NODE_POLICIES } from './constants';

export default class kubernetesResetCtrl {
  /* @ngInject */
  constructor($translate, OvhApiCloudProjectKube, Kubernetes) {
    this.$translate = $translate;
    this.OvhApiCloudProjectKube = OvhApiCloudProjectKube;
    this.RESET_CONFIRMATION_INPUT = RESET_CONFIRMATION_INPUT;
    this.WORKER_NODE_POLICIES = WORKER_NODE_POLICIES;
    this.Kubernetes = Kubernetes;
  }

  $onInit() {
    this.isReseting = false;
    const privateNetworkNone = {
      id: null,
      name: this.$translate.instant('kubernetes_add_private_network_none'),
    };
    this.availablePrivateNetworks = [
      privateNetworkNone,
      ...this.Kubernetes.constructor.getAvailablePrivateNetworks(
        this.privateNetworks,
        this.cluster.region,
      ),
    ];
    const currentPrivateNetwork = this.Kubernetes.constructor.getPrivateNetwork(
      this.availablePrivateNetworks,
      this.cluster.privateNetworkId,
    );
    this.model = {
      version: kubernetesResetCtrl.getFormatedVersion(this.cluster.version),
      workerNodesPolicy: WORKER_NODE_POLICIES.DELETE,
      privateNetwork: currentPrivateNetwork || privateNetworkNone,
    };
  }

  /**
   * reset
   *
   * @memberof kubernetesResetCtrl
   */
  reset() {
    this.isReseting = true;
    const options = {
      version: this.model.version,
      workerNodesPolicy: this.model.workerNodesPolicy,
      privateNetworkId: this.model.privateNetwork.clusterRegion?.openstackId,
    };
    return this.OvhApiCloudProjectKube.v6()
      .reset(
        {
          serviceName: this.projectId,
          kubeId: this.kubeId,
        },
        options,
      )
      .$promise.then(() =>
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_kubernetes_service_reset_success',
          ),
        ),
      )
      .catch((error) =>
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_kubernetes_service_reset_error',
            {
              message: get(error, 'data.message'),
            },
          ),
          'error',
        ),
      );
  }

  static getFormatedVersion(version) {
    return version.substring(0, version.lastIndexOf('.'));
  }
}
