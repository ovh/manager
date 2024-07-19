import {
  SUBNET_DOC,
  LOAD_BALANCER_DOC,
  GATEWAY_IP_REGEX,
} from './network-form.constants';
import KubernetesService from '../../service';

export default class NetworkFormController {
  /* @ngInject */
  constructor($translate, Kubernetes, coreConfig) {
    this.$translate = $translate;
    this.Kubernetes = Kubernetes;

    this.subnetDocumentationLink =
      SUBNET_DOC[coreConfig.getUser().ovhSubsidiary] ?? SUBNET_DOC.DEFAULT;
    this.loadBalancerDocumentationLink =
      LOAD_BALANCER_DOC[coreConfig.getUser().ovhSubsidiary] ??
      LOAD_BALANCER_DOC.DEFAULT;

    this.GATEWAY_IP_REGEX = GATEWAY_IP_REGEX;

    this.isLoadingSubnets = false;
    this.subnets = [];
    this.subnetsByRegion = [];
    this.subnetError = '';
    this.loadBalancersSubnet = null;
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

  get isSubnetShown() {
    return (
      this.hasPrivateNetwork &&
      !this.isLoadingSubnets &&
      !!this.subnetsByRegion.length
    );
  }

  get shouldWarnSubnet() {
    return (
      !this.isLoadingSubnets && Boolean(this.subnet) && !this.subnet.gatewayIp
    );
  }

  get shouldWarnLoadBalancerSubnet() {
    return (
      !this.isLoadingSubnets &&
      Boolean(this.subnet?.gatewayIp) &&
      Boolean(this.loadBalancersSubnet?.id) &&
      !this.loadBalancersSubnet.gatewayIp
    );
  }

  $onChanges({ region }) {
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
            this.isLoadBalancersSubnetShown = this.hasLoadBalancersSubnet;
          });
        }
      } else {
        [this.privateNetwork] = this.privateNetworks;
      }
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
      .then(({ subnets, subnetsByRegion }) => {
        this.subnets = this.augmentSubnets(subnets, { none: true });
        this.subnetsByRegion = this.augmentSubnets(subnetsByRegion);
        this.subnetError = '';
        this.subnet = selectSubnet
          ? selectSubnet(this.subnetsByRegion)
          : this.subnetsByRegion[0];
        this.loadBalancersSubnet = selectLoadBalancersSubnet
          ? selectLoadBalancersSubnet(this.subnets)
          : this.subnets[0];
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
