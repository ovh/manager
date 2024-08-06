import {
  SUBNET_DOC,
  LOAD_BALANCER_DOC,
  GATEWAY_IP_REGEX,
  MODE,
} from './network-form.constants';
import KubernetesService from '../../service';

export default class NetworkFormController {
  /* @ngInject */
  constructor($translate, Kubernetes, coreConfig) {
    this.$translate = $translate;
    this.Kubernetes = Kubernetes;
    this.MODE = MODE;

    this.subnetDocumentationLink =
      SUBNET_DOC[coreConfig.getUser().ovhSubsidiary] ?? SUBNET_DOC.DEFAULT;
    this.loadBalancerDocumentationLink =
      LOAD_BALANCER_DOC[coreConfig.getUser().ovhSubsidiary] ??
      LOAD_BALANCER_DOC.DEFAULT;

    this.GATEWAY_IP_REGEX = GATEWAY_IP_REGEX;

    this.isLoadingSubnets = false;
    this.loadBalancersSubnets = [];
    this.nodesSubnets = [];
    this.subnetError = '';
    this.loadBalancersSubnet = null;
    this.mode = MODE.CREATE;
    this.isLoadBalancersSubnetShown = null;
    this.initialGateway = null;
    this.gatewayMode = 'auto';
  }

  get hasPrivateNetwork() {
    return Boolean(this.privateNetwork?.id);
  }

  get hasSubnet() {
    return Boolean(this.subnet?.id);
  }

  get hasLoadBalancersSubnet() {
    return Boolean(this.loadBalancersSubnet?.id);
  }

  get hasGatewayChanged() {
    return !angular.equals(this.initialGateway, this.gateway);
  }

  get isCreateMode() {
    return this.mode === MODE.CREATE;
  }

  get isEditMode() {
    return this.mode === MODE.EDIT;
  }

  get isSubnetShown() {
    return (
      this.hasPrivateNetwork &&
      !this.isLoadingSubnets &&
      !!this.nodesSubnets.length
    );
  }

  get shouldWarnRebuild() {
    return this.isEditMode && this.hasGatewayChanged;
  }

  get shouldWarnSubnet() {
    // Subnet is disabled in Mode.Edit => hide the subnet warning
    return (
      !this.isLoadingSubnets &&
      Boolean(this.subnet) &&
      !this.subnet.gatewayIp &&
      this.isCreateMode
    );
  }

  get shouldWarnLoadBalancerSubnet() {
    const subnetHasGatewayIp = Boolean(this.subnet?.gatewayIp);
    const lbSubnetHasNoGatewayIp =
      Boolean(this.loadBalancersSubnet?.id) &&
      !this.loadBalancersSubnet.gatewayIp;

    return (
      (!this.isLoadingSubnets &&
        subnetHasGatewayIp &&
        lbSubnetHasNoGatewayIp) ||
      // Subnet is disabled in Mode.Edit => show the lb subnet warning if needed
      (this.isEditMode && lbSubnetHasNoGatewayIp)
    );
  }

  $onChanges({ region, mode }) {
    if (!this.boundPrivateNetworks) {
      this.boundPrivateNetworks = [...this.privateNetworks];
    }

    if (region?.currentValue) {
      this.privateNetworks = [
        {
          id: null,
          name: this.$translate.instant('kubernetes_network_form_none'),
        },
        ...KubernetesService.getAvailablePrivateNetworks(
          this.boundPrivateNetworks,
          this.region.name,
        ),
      ];

      if (this.hasPrivateNetwork) {
        const foundPrivateNetwork = KubernetesService.getPrivateNetwork(
          this.privateNetworks,
          this.privateNetwork.id,
        );
        if (foundPrivateNetwork) {
          this.privateNetwork = foundPrivateNetwork;
          this.loadSubnets({
            ...(this.hasSubnet && {
              selectSubnet: (subnets) =>
                subnets.find(({ id }) => this.subnet.id === id),
            }),
            ...(this.hasLoadBalancersSubnet && {
              selectLoadBalancersSubnet: (subnets) =>
                subnets.find(({ id }) => this.loadBalancersSubnet.id === id),
            }),
          }).then(() => {
            if (this.isLoadBalancersSubnetShown === null) {
              this.isLoadBalancersSubnetShown = this.hasLoadBalancersSubnet;
            }
          });
        }
      } else {
        [this.privateNetwork] = this.privateNetworks;
      }
    }

    if (mode) {
      this.mode = Object.values(MODE).includes(mode.currentValue)
        ? mode.currentValue
        : MODE.CREATE;

      if (this.isLoadBalancersSubnetShown === null) {
        this.isLoadBalancersSubnetShown = this.isEditMode;
      }
    }
  }

  $onInit() {
    this.initialGateway = angular.copy(this.gateway);
    if (this.gateway.ip) {
      this.gatewayMode = 'custom';
    }
  }

  onPrivateNetworkChanged() {
    this.subnet = null;
    this.loadBalancersSubnet = null;
    return this.hasPrivateNetwork ? this.loadSubnets() : null;
  }

  loadSubnets({ selectSubnet, selectLoadBalancersSubnet } = {}) {
    this.isLoadingSubnets = true;

    return this.Kubernetes.getPrivateNetworkSubnets(
      this.projectId,
      this.privateNetwork.id,
      this.region.name,
    )
      .then(({ subnetsByRegion }) => {
        this.loadBalancersSubnets = this.augmentSubnets(subnetsByRegion, {
          none: true,
        });
        this.nodesSubnets = this.augmentSubnets(subnetsByRegion);
        this.subnetError = '';
        this.subnet = selectSubnet
          ? selectSubnet(this.nodesSubnets)
          : this.nodesSubnets[0];
        this.loadBalancersSubnet = selectLoadBalancersSubnet
          ? selectLoadBalancersSubnet(this.loadBalancersSubnets)
          : this.loadBalancersSubnets[0];
        this.onSubnetChanged(this.subnet);
      })
      .catch((error) => {
        this.subnetError = error.data?.message;
      })
      .finally(() => {
        this.isLoadingSubnets = false;
      });
  }

  toggleLoadBalancersSubnet() {
    this.isLoadBalancersSubnetShown = !this.isLoadBalancersSubnetShown;
  }

  onGatewayChanged() {
    if (!this.gateway.enabled) {
      this.gateway.ip = '';
      this.gatewayMode = 'auto';
    }
  }

  onGatewayModeChanged() {
    if (this.gatewayMode === 'auto') {
      this.gateway.ip = '';
    } else if (this.gatewayMode === 'custom') {
      // Intentionally using undefined as the initial NgModelController's value
      this.gateway.ip = this.initialGateway?.ip || undefined;
    }
  }

  augmentSubnets(subnets, { none = false } = {}) {
    const noneItem = none
      ? {
          id: null,
          displayedLabel: this.$translate.instant(
            'kubernetes_network_form_subnet_none',
          ),
        }
      : null;
    return [
      ...((noneItem && [noneItem]) || []),
      ...subnets.map((subnet) => ({
        ...subnet,
        displayedLabel: `${subnet.id} - ${subnet.cidr}`,
      })),
    ];
  }
}
