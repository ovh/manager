import {
  NETWORK_PRIVATE_VISIBILITY,
  PRODUCT_LINK,
  REGION_AVAILABILITY_LINK,
} from './constants';

export default class OctaviaLoadBalancerCreateCtrl {
  /* @ngInject */
  constructor($http, coreConfig) {
    this.$http = $http;
    this.user = coreConfig.getUser();
  }

  $onInit() {
    this.productPageLink =
      PRODUCT_LINK[this.user.ovhSubsidiary] || PRODUCT_LINK.DEFAULT;

    this.regionPageLink =
      REGION_AVAILABILITY_LINK[this.user.ovhSubsidiary] ||
      REGION_AVAILABILITY_LINK.DEFAULT;

    this.model = {};

    this.stepper = {
      loadBalancerSize: { name: 'load_balancer_size', display: null },
      loadBalancerRegion: { name: 'load_balancer_region', display: null },
      loadBalancerPrivateNetwork: {
        name: 'load_balancer_private_network',
        display: null,
      },
    };
  }

  onSizeChange(newSize) {
    this.model.size = newSize;
    this.model.region = {};
    this.regionsFilteredBySize = this.regionsPlansGroupBySize.find(
      (plan) => plan.size === newSize.code,
    ).regions;
  }

  onRegionChange(region) {
    this.model.region = region;
    this.regionSelected();
  }

  regionSelected() {
    this.privateNetworkLoading = true;
    this.$http
      .get(
        `/cloud/project/${this.projectId}/region/${this.model.region.name}/network`,
      )
      .then(({ data }) => {
        this.privateNetworks = data.filter(
          (network) => network.visibility === NETWORK_PRIVATE_VISIBILITY,
        );
        [this.model.privateNetwork] = this.privateNetworks;
        this.getSubnets(this.privateNetworks[0]);
      })
      .finally(() => {
        this.privateNetworkLoading = false;
      });
  }

  getSubnets(privateNetwork) {
    this.subnetLoading = true;
    this.$http
      .get(
        `/cloud/project/${this.projectId}/region/${this.model.region.name}/network/${privateNetwork.id}/subnet`,
      )
      .then(({ data }) => {
        this.subnets = data.map((subnet) => ({
          ...subnet,
          displayName:
            subnet.name !== ''
              ? `${subnet.name} - ${subnet.cidr}`
              : subnet.cidr,
        }));
        if (this.subnets?.length > 0) {
          [this.model.subnet] = this.subnets;
          this.checkGateway(this.subnets[0]);
        } else {
          this.model.subnet = null;
        }
      })
      .finally(() => {
        this.subnetLoading = false;
      });
  }

  checkGateway(subnet) {
    this.gatewayLoading = true;
    this.$http
      .get(
        `/cloud/project/${this.projectId}/region/${this.model.region.name}/gateway?subnetId=${subnet.id}`,
      )
      .then(({ data }) => {
        this.gateways = data;
        this.subnetLoading = false;
      })
      .finally(() => {
        this.gatewayLoading = false;
      });
  }

  createLoadBalancer() {
    // TODO: REMOVE THIS LINE
    this.model.submit = true;
  }
}
