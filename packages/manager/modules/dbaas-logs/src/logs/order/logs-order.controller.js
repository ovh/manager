export default class LogsOrderCtrl {
  /* @ngInject */
  constructor(
    $http,
    $state,
    $translate,
    coreConfig,
    atInternet,
    CucOrderHelperService,
    LogsConstants,
  ) {
    this.$http = $http;
    this.$translate = $translate;
    this.$state = $state;
    this.atInternet = atInternet;
    this.region = coreConfig.getRegion();
    this.LogsConstants = LogsConstants;
    this.CucOrderHelperService = CucOrderHelperService;
  }

  $onInit() {
    this.regions = [];
    this.isLoading = true;
    this.selectedOffer = undefined;
    this.selectedDatacenter = undefined;
    this.workflowOptions = {
      catalog: this.catalog,
    };
    this.selectOffer(this.LogsConstants.LDP_PLAN_CODE);
  }

  selectOffer(offerName) {
    const { plans } = this.workflowOptions.catalog;
    const selectedPlan = plans.find((plan) => plan.planCode === offerName);
    const regions = selectedPlan.configurations.find(
      (config) => config.name === 'region',
    ).values;
    this.regions = regions.sort();
  }

  onOrder() {
    this.atInternet.trackClick({
      name: `dbaas::logs::order::${
        this.selectedOffer === this.LogsConstants.LDP_PLAN_CODE
          ? 'activate'
          : 'pay'
      }`,
      type: 'action',
    });
    this.CucOrderHelperService.buildUrl(
      `/order/express/#/new/express/resume?products=~(~(planCode~'${this.selectedOffer}~productId~'logs~region~'${this.selectedDatacenter}))`,
    ).then((url) => {
      window.top.location.href = url;
    });
  }

  onCancel() {
    this.$state.go('dbaas-logs.list');
  }

  onSubmitOffer() {
    this.atInternet.trackClick({
      name: `dbaas::logs::order::step1_next_${this.selectedOffer}`,
      type: 'action',
    });
  }

  onSubmitLocation() {
    this.atInternet.trackClick({
      name: `dbaas::logs::order::step2_next_${this.selectedDatacenter}`,
      type: 'action',
    });
  }
}
