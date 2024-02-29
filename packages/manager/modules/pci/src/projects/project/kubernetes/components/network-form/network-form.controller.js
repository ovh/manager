import { SUBNET_DOC, GATEWAY_IP_REGEX } from './network-form.constants';
import KubernetesService from '../../service';

export default class NetworkFormController {
  /* @ngInject */
  constructor($translate, Kubernetes, coreConfig) {
    this.$translate = $translate;
    this.Kubernetes = Kubernetes;

    this.subnetDocumentationLink =
      SUBNET_DOC[coreConfig.getUser().ovhSubsidiary] ?? SUBNET_DOC.DEFAULT;

    this.GATEWAY_IP_REGEX = GATEWAY_IP_REGEX;

    this.isLoadingSubnets = false;
    this.subnets = [];
    this.subnetError = null;
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
      this.hasPrivateNetwork && !this.isLoadingSubnets && !!this.subnets.length
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
    if (!this.hasPrivateNetwork) {
      this.gateway = { enabled: false, ip: '' };
    }
    return this.hasPrivateNetwork ? this.loadSubnets() : null;
  }

  loadSubnets({ selectSubnet, selectLoadBalancersSubnet } = {}) {
    this.isLoadingSubnets = true;

    return this.Kubernetes.getPrivateNetworkSubnets(
      this.projectId,
      this.privateNetwork.id,
    )
      .then((subnets) => {
        this.subnets = subnets;
        this.subnetError = null;
        this.subnet = selectSubnet ? selectSubnet(this.subnets) : subnets[0];
        this.loadBalancersSubnet = selectLoadBalancersSubnet
          ? selectLoadBalancersSubnet(this.subnets)
          : null;
        this.onSubnetChanged(this.subnet);
      })
      .catch((error) => {
        this.subnetError = {
          type: 'error',
          message: this.$translate.instant(
            'kubernetes_network_form_subnet_error_default',
            { error: error.data?.message || error.message },
          ),
        };
      })
      .finally(() => {
        this.isLoadingSubnets = false;
      });
  }

  onSubnetChanged({ gatewayIp } = {}) {
    this.subnetError = !gatewayIp
      ? {
          type: 'warning',
          message: this.$translate.instant(
            'kubernetes_network_form_subnet_error_no_gateway_ip',
          ),
        }
      : null;
  }

  toggleLoadBalancersSubnet() {
    this.isLoadBalancersSubnetShown = !this.isLoadBalancersSubnetShown;
    if (!this.isLoadBalancersSubnetShown) {
      this.loadBalancersSubnet = null;
    }
  }

  onGatewayChanged() {
    if (!this.gateway.enabled) {
      this.gateway.ip = '';
    }
  }
}
