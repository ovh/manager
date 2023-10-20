import {
  GETTING_STARTED_LINK,
  LOAD_BALANCER_NAME_REGEX,
  MAX_INSTANCES_BY_LISTENER,
  MAX_LISTENER,
  PRODUCT_LINK,
  REGION_AVAILABILITY_LINK,
  TRACKING_INSTANCE_DOCUMENTATION,
  TRACKING_LOAD_BALANCER_CREATION_CANCEL,
  TRACKING_LOAD_BALANCER_CREATION_SUBMIT,
  TRACKING_LOAD_BALANCER_CREATION_SUBMIT_DETAIL,
  TRACKING_LOAD_BALANCER_CREATION_SUBMIT_ERROR,
  TRACKING_LOAD_BALANCER_CREATION_SUBMIT_SUCCESS,
  TRACKING_PRIVATE_NETWORK_CREATION,
  TRACKING_PRODUCT_PAGE,
  TRACKING_REGION_AVAILABILITY,
} from './constants';

export default class OctaviaLoadBalancerCreateCtrl {
  /* @ngInject */
  constructor(
    $anchorScroll,
    atInternet,
    coreConfig,
    OctaviaLoadBalancerCreateService,
  ) {
    this.$anchorScroll = $anchorScroll;
    this.atInternet = atInternet;
    this.user = coreConfig.getUser();
    this.OctaviaLoadBalancerCreateService = OctaviaLoadBalancerCreateService;
    this.maxListener = MAX_LISTENER;
    this.maxInstancesByListener = MAX_INSTANCES_BY_LISTENER;
  }

  $onInit() {
    this.trackingProductPage = TRACKING_PRODUCT_PAGE;
    this.trackingRegionAvailability = TRACKING_REGION_AVAILABILITY;
    this.trackingPrivateNetworkCreation = TRACKING_PRIVATE_NETWORK_CREATION;
    this.trackingInstanceDocumentation = TRACKING_INSTANCE_DOCUMENTATION;

    this.productPageLink =
      PRODUCT_LINK[this.user.ovhSubsidiary] || PRODUCT_LINK.DEFAULT;

    this.regionPageLink =
      REGION_AVAILABILITY_LINK[this.user.ovhSubsidiary] ||
      REGION_AVAILABILITY_LINK.DEFAULT;

    this.gettingStartedLink =
      GETTING_STARTED_LINK[this.user.ovhSubsidiary] ||
      GETTING_STARTED_LINK.DEFAULT;

    this.loadBalancerNameRegex = LOAD_BALANCER_NAME_REGEX;

    this.stepper = {
      loadBalancerSize: { name: 'load_balancer_size', display: null },
      loadBalancerRegion: { name: 'load_balancer_region', display: null },
      loadBalancerPrivateNetwork: {
        name: 'load_balancer_private_network',
        display: null,
      },
      loadBalancerInstance: { name: 'load_balancer_instance', display: null },
      loadBalancerName: { name: 'load_balancer_name', display: null },
    };

    this.resetCurrentStep();
  }

  resetCurrentStep() {
    this.currentStep = 0;
    this.model = {};
  }

  regionStepFocus() {
    delete this.model.region;
    delete this.model.privateNetwork;
    delete this.model.subnet;
    delete this.model.listeners;
  }

  privateNetworkStepFocus() {
    delete this.model.listeners;
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
    this.model.loadBalancerName = `LB_${this.model.size.label}_${this.model.region.name}`;
    this.getPrivateNetworks();
  }

  getPrivateNetworks() {
    this.privateNetworkLoading = true;
    this.OctaviaLoadBalancerCreateService.getPrivateNetworks(
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
    this.OctaviaLoadBalancerCreateService.getSubnets(
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
    this.OctaviaLoadBalancerCreateService.checkGateway(
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

  skipListeners() {
    this.model.listeners = [];
    this.currentStep += 1;
  }

  onCancel() {
    this.resetCurrentStep();
    this.atInternet.trackClick({
      name: TRACKING_LOAD_BALANCER_CREATION_CANCEL,
      type: 'action',
    });
  }

  createLoadBalancer() {
    this.atInternet.trackClick({
      name: TRACKING_LOAD_BALANCER_CREATION_SUBMIT,
      type: 'action',
    });

    this.atInternet.trackClick({
      name: `${TRACKING_LOAD_BALANCER_CREATION_SUBMIT_DETAIL}::${this.model.size.code}::${this.model.region.name}`,
      type: 'action',
    });

    this.OctaviaLoadBalancerCreateService.createLoadBalancer(
      this.projectId,
      this.model.size,
      this.model.region.name,
      this.model.privateNetwork,
      this.model.subnet,
      this.gateways,
      this.model.listeners,
      this.model.loadBalancerName,
    )
      .then(() => {
        this.atInternet.trackPage({
          name: TRACKING_LOAD_BALANCER_CREATION_SUBMIT_SUCCESS,
        });

        this.goToListingPage();
      })
      .catch(() => {
        this.$anchorScroll();
        this.atInternet.trackPage({
          name: TRACKING_LOAD_BALANCER_CREATION_SUBMIT_ERROR,
        });
      });
  }
}
