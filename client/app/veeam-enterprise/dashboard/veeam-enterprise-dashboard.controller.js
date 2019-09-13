class VeeamEnterpriseDashboardCtrl {
  constructor($stateParams, $translate, CucControllerHelper, CucFeatureAvailabilityService,
    VeeamEnterpriseService, REDIRECT_URLS) {
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.CucControllerHelper = CucControllerHelper;
    this.CucFeatureAvailabilityService = CucFeatureAvailabilityService;
    this.VeeamEnterpriseService = VeeamEnterpriseService;
    this.REDIRECT_URLS = REDIRECT_URLS;

    this.serviceName = this.$stateParams.serviceName;

    this.initLoaders();
    this.initActions();
  }

  initLoaders() {
    const errorHandler = response => this.VeeamEnterpriseService.unitOfWork.messages.push({
      text: response.message,
      type: 'error',
    });

    this.configurationInfos = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () => this.VeeamEnterpriseService.getConfigurationInfos(this.serviceName),
      errorHandler,
    });

    this.subscriptionInfos = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () => this.VeeamEnterpriseService.getSubscriptionInfos(this.serviceName),
      errorHandler,
    });
  }

  initActions() {
    this.uiActions = {
      manageAutorenew: {
        text: this.$translate.instant('common_manage'),
        href: this.CucControllerHelper.navigation.constructor.getUrl(
          _.get(this.REDIRECT_URLS, 'renew'), {
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

  activateLicense() {
    this.CucControllerHelper.modal.showModal({
      modalConfig: {
        templateUrl: 'app/veeam-enterprise/dashboard/license/veeam-enterprise-license.html',
        controller: 'VeeamEnterpriseLicenseCtrl',
        controllerAs: '$ctrl',
        resolve: {
          action: () => 'register',
          serviceName: () => this.serviceName,
        },
      },
    });
  }

  updateLicense() {
    this.CucControllerHelper.modal.showModal({
      modalConfig: {
        templateUrl: 'app/veeam-enterprise/dashboard/license/veeam-enterprise-license.html',
        controller: 'VeeamEnterpriseLicenseCtrl',
        controllerAs: '$ctrl',
        resolve: {
          action: () => 'update',
          serviceName: () => this.serviceName,
        },
      },
    });
  }

  terminateLicense() {
    this.CucControllerHelper.modal.showModal({
      modalConfig: {
        templateUrl: 'app/veeam-enterprise/dashboard/terminate/veeam-enterprise-terminate.html',
        controller: 'VeeamEnterpriseTerminateCtrl',
        controllerAs: '$ctrl',
        resolve: {
          serviceName: () => this.serviceName,
        },
      },
    });
  }
}

angular.module('managerApp').controller('VeeamEnterpriseDashboardCtrl', VeeamEnterpriseDashboardCtrl);
