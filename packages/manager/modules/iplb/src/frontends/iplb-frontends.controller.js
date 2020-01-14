import assign from 'lodash/assign';
import set from 'lodash/set';

// import IplbFrontendsPreviewTemplate from './preview/iplb-frontends-preview.html';

export default class IpLoadBalancerFrontendsCtrl {
  /* @ngInject */
  constructor($state, $translate, CucCloudMessage, CucControllerHelper,
    IpLoadBalancerFrontendsService) {
    this.$state = $state;
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.CucControllerHelper = CucControllerHelper;
    this.IpLoadBalancerFrontendService = IpLoadBalancerFrontendsService;
  }

  $onInit() {
    this.init();
  }

  init() {
    this.loading = true;
    this.IpLoadBalancerFrontendService.getFrontends(this.serviceName)
      .then((results) => {
        this.loading = false;
        this.frontends = results;
      });
  }

  loadFarm(frontend) {
    if (!frontend.defaultFarmId) {
      set(frontend, 'defaultFarm', null);
    }
    return this.IpLoadBalancerFrontendService
      .getFarm(frontend.protocol, this.serviceName, frontend.defaultFarmId)
      .then((farm) => ({ defaultFarm: farm }));
  }

  toggle(frontend) {
    // frontend.disabled = !frontend.disabled;
    this.IpLoadBalancerFrontendService.toggleFrontend(
      frontend.protocol,
      this.serviceName,
      assign({}, frontend, {
        disabled: !frontend.disabled,
      }),
    ).then(() => {
      // Apply value on model
      set(frontend, 'disabled', !frontend.disabled);
    });
  }
}
