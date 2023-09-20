import { PRODUCT_LINK, REGION_AVAILABILITY_LINK } from './constants';

export default class OctaviaLoadBalancerCreateCtrl {
  /* @ngInject */
  constructor(coreConfig, OctaviaLoadBalancerCreateService) {
    this.user = coreConfig.getUser();
    this.CreateService = OctaviaLoadBalancerCreateService;
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
    this.CreateService.getPrivateNetworks(
      this.projectId,
      this.model.region.name,
    )
      .then((privateNetworks) => {
        this.privateNetworks = privateNetworks;
        [this.model.privateNetwork] = privateNetworks;
        this.getSubnets(privateNetworks[0]);
      })
      .finally(() => {
        this.privateNetworkLoading = false;
      });
  }

  getSubnets(privateNetwork) {
    this.subnetLoading = true;
    this.CreateService.getSubnets(
      this.projectId,
      this.model.region.name,
      privateNetwork,
    )
      .then((subnets) => {
        this.subnets = subnets;
        if (subnets?.length > 0) {
          [this.model.subnet] = subnets;
          this.checkGateway(subnets[0]);
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
    this.CreateService.checkGateway(
      this.projectId,
      this.model.region.name,
      subnet,
    )
      .then((gateways) => {
        this.gateways = gateways;
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
