export default class IpLoadBalancerZoneAddCtrl {
  /* @ngInject */
  constructor(
    $q,
    $state,
    $translate,
    $stateParams,
    CucCloudMessage,
    CucCloudNavigation,
    CucControllerHelper,
    IpLoadBalancerZoneAddService,
  ) {
    this.$state = $state;
    this.$q = $q;
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.CucCloudNavigation = CucCloudNavigation;
    this.CucControllerHelper = CucControllerHelper;
    this.IpLoadBalancerZoneAddService = IpLoadBalancerZoneAddService;

    this.serviceName = $stateParams.serviceName;

    this.initLoaders();
    this.initModel();
  }

  $onInit() {
    this.zones.load();
  }

  submit() {
    if (this.form.$invalid) {
      return this.$q.reject();
    }

    this.saving = true;
    this.CucCloudMessage.flushChildMessage();
    return this.IpLoadBalancerZoneAddService.addZones(
      this.serviceName,
      this.model.zones.value,
    )
      .then(() => this.$state.go('iplb.detail.home'))
      .finally(() => {
        this.saving = false;
      });
  }

  isLoading() {
    return this.saving || this.zones.loading;
  }

  initLoaders() {
    this.zones = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () =>
        this.IpLoadBalancerZoneAddService.getOrderableZones(this.serviceName),
    });
  }

  initModel() {
    this.model = {
      zones: {
        value: [],
      },
    };
  }
}
