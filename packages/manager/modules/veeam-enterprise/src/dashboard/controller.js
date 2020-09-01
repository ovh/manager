import 'moment';

import { RENEW_URL } from '../details/constants';

export default class VeeamEnterpriseDashboardCtrl {
  /* @ngInject */
  constructor(
    $stateParams,
    $translate,
    CucControllerHelper,
    CucFeatureAvailabilityService,
    VeeamEnterpriseService,
    goToLicenseActivate,
    goToLicenseUpdate,
    goToLicenseTerminate,
  ) {
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.CucControllerHelper = CucControllerHelper;
    this.CucFeatureAvailabilityService = CucFeatureAvailabilityService;
    this.VeeamEnterpriseService = VeeamEnterpriseService;
    this.goToLicenseActivate = goToLicenseActivate;
    this.goToLicenseUpdate = goToLicenseUpdate;
    this.goToLicenseTerminate = goToLicenseTerminate;

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
        href: this.CucControllerHelper.navigation.constructor.getUrl(
          RENEW_URL,
          {
            serviceName: this.serviceName,
            serviceType: 'VEEAM_ENTERPRISE',
          },
        ),
        isAvailable: () => true,
      },
    };
  }

  $onInit() {
    this.configurationInfos.load();
    this.subscriptionInfos.load();
  }
}
