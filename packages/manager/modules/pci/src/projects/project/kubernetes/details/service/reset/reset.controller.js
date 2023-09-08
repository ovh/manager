import get from 'lodash/get';

import {
  RESET_CONFIRMATION_INPUT,
  WORKER_NODE_POLICIES,
  KUBEPROXYMODE,
  KUBEPROXYMODE_VALUE,
  KUBEPROXYMODE_SCHEDULER,
} from './constants';

export default class kubernetesResetCtrl {
  /* @ngInject */
  constructor($translate, OvhApiCloudProjectKube, Kubernetes) {
    this.$translate = $translate;
    this.OvhApiCloudProjectKube = OvhApiCloudProjectKube;
    this.RESET_CONFIRMATION_INPUT = RESET_CONFIRMATION_INPUT;
    this.WORKER_NODE_POLICIES = WORKER_NODE_POLICIES;
    this.KUBEPROXYMODE = KUBEPROXYMODE;
    this.KUBEPROXYMODE_SCHEDULER = KUBEPROXYMODE_SCHEDULER;
    this.Kubernetes = Kubernetes;
  }

  $onInit() {
    const kubeProxyMode = KUBEPROXYMODE.IPTABLES;
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
      kubeProxyMode,
      kubeProxy: KUBEPROXYMODE_VALUE[kubeProxyMode],
      network: {
        private: currentPrivateNetwork || privateNetworkNone,
        gateway: {
          enabled: !!this.cluster?.privateNetworkConfiguration
            ?.defaultVrackGateway, // false -> OVHcloud gateway, true -> vRack gateway
          ip:
            this.cluster?.privateNetworkConfiguration?.defaultVrackGateway ||
            '',
        },
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
      kubeProxyMode: this.model.kubeProxyMode,
      customization: {
        kubeProxy: {
          [this.model.kubeProxyMode]: this.model.kubeProxy,
        },
      },
      privateNetworkId: this.model.network.private.clusterRegion?.openstackId,
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

  onResetCancel() {
    this.sendKubeTrack('details::service::reset::cancel');
    this.goBack();
  }

  onKubeProxyModeChange() {
    this.model.kubeProxy = KUBEPROXYMODE_VALUE[this.model.kubeProxyMode];
  }

  static getFormatedVersion(version) {
    return version.substring(0, version.lastIndexOf('.'));
  }

  static getDuration(duration) {
    return duration?.match(/([0-9]+)/)?.[1] || '';
  }
}
