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
    this.model = {
      version: kubernetesResetCtrl.getFormatedVersion(this.cluster.version),
      workerNodesPolicy: WORKER_NODE_POLICIES.DELETE,
      network: {
        private: this.cluster.privateNetworkId
          ? { id: this.cluster.privateNetworkId }
          : null,
        gateway: {
          enabled: !!this.cluster?.privateNetworkConfiguration
            ?.defaultVrackGateway, // false -> OVHcloud gateway, true -> vRack gateway
          ip:
            this.cluster?.privateNetworkConfiguration?.defaultVrackGateway ||
            '',
        },
        subnet: this.cluster.nodesSubnetId
          ? { id: this.cluster.nodesSubnetId }
          : null,
        loadBalancersSubnet: this.cluster.loadBalancersSubnetId
          ? { id: this.cluster.loadBalancersSubnetId }
          : null,
      },
    };
  }

  /**
   * reset
   *
   * @memberof kubernetesResetCtrl
   */
  reset() {
    this.sendKubeTrack('details::service::reset::confirm');

    this.isReseting = true;
    const options = {
      version: this.model.version,
      workerNodesPolicy: this.model.workerNodesPolicy,
      privateNetworkId: this.model.network.private.clusterRegion?.openstackId,
      ...(this.model.network.subnet?.id && {
        nodesSubnetId: this.model.network.subnet?.id,
      }),
      ...(this.model.network.loadBalancersSubnet?.id && {
        loadBalancersSubnetId: this.model.network.loadBalancersSubnet?.id,
      }),
      ...(this.model.network.gateway.enabled && {
        privateNetworkConfiguration: {
          defaultVrackGateway: this.model.network.gateway.ip,
          privateNetworkRoutingAsDefault: true,
        },
      }),
    };
    return this.Kubernetes.resetCluster(this.projectId, this.kubeId, options)
      .then(() =>
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

  onResetModalCancel() {
    this.sendKubeTrack('details::service::reset::cancel');
    this.goBack();
  }

  isNetworkValid() {
    if (this.kubeClusterReset?.$invalid) {
      return false;
    }
    const { private: privateNetwork, subnet } = this.model.network;
    return !privateNetwork?.id || Boolean(subnet?.id);
  }

  static getFormatedVersion(version) {
    return version.substring(0, version.lastIndexOf('.'));
  }
}
