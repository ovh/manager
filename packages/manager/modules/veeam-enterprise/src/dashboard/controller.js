import 'moment';

export default class VeeamEnterpriseDashboardCtrl {
  /* @ngInject */
  constructor(
    $stateParams,
    $translate,
    coreURLBuilder,
    CucControllerHelper,
    CucFeatureAvailabilityService,
    VeeamEnterpriseService,
  ) {
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.coreURLBuilder = coreURLBuilder;
    this.CucControllerHelper = CucControllerHelper;
    this.CucFeatureAvailabilityService = CucFeatureAvailabilityService;
    this.VeeamEnterpriseService = VeeamEnterpriseService;

    this.serviceName = this.$stateParams.serviceName;

    this.initLoaders();
    this.initActions();
  }

  initLoaders() {
    const errorHandler = (response) =>
      this.VeeamEnterpriseService.unitOfWork.messages.push({
        text: response.message,
        type: 'error',
      });

    this.configurationInfos = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.VeeamEnterpriseService.getConfigurationInfos(this.serviceName),
      errorHandler,
    });

    this.subscriptionInfos = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.VeeamEnterpriseService.getSubscriptionInfos(this.serviceName).then(
          (subscriptionInfos) => ({
            ...subscriptionInfos,
            data: {
              ...subscriptionInfos.data,
              creation: moment(subscriptionInfos.data.creation).format('LL'),
              expiration: moment(subscriptionInfos.data.expiration).format(
                'LL',
              ),
            },
          }),
        ),
      errorHandler,
    });
  }

  initActions() {
    this.uiActions = {
      manageAutorenew: {
        text: this.$translate.instant('veeam_enterprise_manage'),
        href: this.coreURLBuilder.buildURL('dedicated', '#/billing/autoRenew', {
          searchText: this.serviceName,
          selectedType: 'VEEAM_ENTERPRISE',
        }),
        isAvailable: () => true,
      },
    };
  }

  onAutorenewManageClick() {
    this.trackClick('manage');
  }

  $onInit() {
    this.configurationInfos.load();
    this.subscriptionInfos.load();
  }
}
