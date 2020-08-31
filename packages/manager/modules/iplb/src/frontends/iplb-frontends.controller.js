import assign from 'lodash/assign';
import set from 'lodash/set';

import IplbFrontendsPreviewTemplate from './preview/iplb-frontends-preview.html';

export default class IpLoadBalancerFrontendsCtrl {
  /* @ngInject */
  constructor(
    $state,
    $stateParams,
    $translate,
    CucCloudMessage,
    CucControllerHelper,
    IpLoadBalancerActionService,
    IpLoadBalancerFrontendsService,
  ) {
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.CucControllerHelper = CucControllerHelper;
    this.IpLoadBalancerActionService = IpLoadBalancerActionService;
    this.IpLoadBalancerFrontendService = IpLoadBalancerFrontendsService;
  }

  $onInit() {
    this.init();
  }

  init() {
    this.loading = true;
    this.IpLoadBalancerFrontendService.getFrontends(
      this.$stateParams.serviceName,
    ).then((results) => {
      this.loading = false;
      this.frontends = results;
    });
  }

  loadFarm(frontend) {
    if (!frontend.defaultFarmId) {
      set(frontend, 'defaultFarm', null);
    }
    return this.IpLoadBalancerFrontendService.getFarm(
      frontend.protocol,
      this.$stateParams.serviceName,
      frontend.defaultFarmId,
    ).then((farm) => ({ defaultFarm: farm }));
  }

  update(frontend) {
    this.$state.go('iplb.detail.frontends.update', {
      serviceName: this.$stateParams.serviceName,
      frontendId: frontend.frontendId,
    });
  }

  delete(frontend) {
    this.IpLoadBalancerActionService.deleteFrontend(
      this.$stateParams.serviceName,
      frontend,
    ).then(() => this.init());
  }

  preview(frontend) {
    this.CucControllerHelper.modal.showModal({
      modalConfig: {
        template: IplbFrontendsPreviewTemplate,
        controller: 'IpLoadBalancerFrontendPreviewCtrl',
        controllerAs: 'IpLoadBalancerFrontendPreviewCtrl',
        resolve: {
          frontend: () => frontend,
        },
      },
    });
  }

  toggle(frontend) {
    // frontend.disabled = !frontend.disabled;
    this.IpLoadBalancerFrontendService.toggleFrontend(
      frontend.protocol,
      this.$stateParams.serviceName,
      assign({}, frontend, {
        disabled: !frontend.disabled,
      }),
    ).then(() => {
      // Apply value on model
      set(frontend, 'disabled', !frontend.disabled);
    });
  }
}
