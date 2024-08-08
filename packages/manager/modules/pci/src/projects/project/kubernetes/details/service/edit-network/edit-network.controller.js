import angular from 'angular';
import { MODE as NETWORK_FORM_MODE } from '../../../components/network-form/network-form.constants';

export default class PCIKubernetesEditNetworkController {
  /* @ngInject */
  constructor($translate, Kubernetes) {
    this.$translate = $translate;
    this.Kubernetes = Kubernetes;
    this.NETWORK_FORM_MODE = NETWORK_FORM_MODE;

    this.isEditingNetwork = false;
    this.initialGatewayModel = null;
    this.initialLoadBalancersSubnetModel = null;
    this.model = {
      privateNetwork: null,
      gateway: { enabled: false, ip: '' },
      subnet: null,
      loadBalancersSubnet: null,
    };
  }

  $onInit() {
    const {
      privateNetworkId,
      privateNetworkConfiguration,
      nodesSubnetId,
      loadBalancersSubnetId,
    } = this.cluster;

    this.model.privateNetwork = privateNetworkId
      ? { id: privateNetworkId }
      : null;
    this.model.gateway.enabled = Boolean(
      privateNetworkConfiguration?.privateNetworkRoutingAsDefault,
    );
    this.model.gateway.ip =
      privateNetworkConfiguration?.defaultVrackGateway || '';
    this.model.nodesSubnet = nodesSubnetId ? { id: nodesSubnetId } : null;
    this.model.loadBalancersSubnet = { id: loadBalancersSubnetId ?? null };

    this.initialGatewayModel = angular.copy(this.model.gateway);
    this.initialLoadBalancersSubnetModel = angular.copy(
      this.model.loadBalancersSubnet,
    );
  }

  get hasGatewayChanged() {
    return !angular.equals(this.initialGatewayModel, this.model.gateway);
  }

  get hasLoadBalancersSubnetChanged() {
    return !angular.equals(this.initialLoadBalancersSubnetModel, {
      id: this.model.loadBalancersSubnet?.id,
    });
  }

  get canEditNetwork() {
    return (
      this.editNetworkForm?.$valid &&
      (this.hasGatewayChanged || this.hasLoadBalancersSubnetChanged)
    );
  }

  editNetwork() {
    this.sendKubeTrack('details::service::edit-network::confirm');
    this.isEditingNetwork = true;

    const data = {
      ...(this.hasGatewayChanged && {
        privateNetworkConfiguration: {
          privateNetworkRoutingAsDefault: this.model.gateway.enabled,
          defaultVrackGateway: this.model.gateway.ip,
        },
      }),
      ...(this.hasLoadBalancersSubnetChanged && {
        loadBalancersSubnetId: this.model.loadBalancersSubnet?.id
          ? this.model.loadBalancersSubnet.id
          : null,
      }),
    };

    return this.Kubernetes.editNetwork(this.projectId, this.kubeId, data)
      .then(() =>
        this.goBack(
          this.$translate.instant('pci_kubernetes_edit_network_success'),
          'success',
        ),
      )
      .catch((error) =>
        this.goBack(
          this.$translate.instant('pci_kubernetes_edit_network_error', {
            message: error.data?.message || error.message || 'N/A',
          }),
          'error',
        ),
      );
  }

  onEditNetworkCancel() {
    this.sendKubeTrack('details::service::edit-network::cancel');
    this.goBack();
  }
}
