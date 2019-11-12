import licenseTemplate from './license/template.html';
import terminateTemplate from './terminate/template.html';

import { RENEW_URL } from '../constants';

export default class VeeamEnterpriseDashboardCtrl {
  /* @ngInject */
  constructor(
    $stateParams,
    $translate,
    CucControllerHelper,
    CucFeatureAvailabilityService,
    VeeamEnterpriseService,
  ) {
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.CucControllerHelper = CucControllerHelper;
    this.CucFeatureAvailabilityService = CucFeatureAvailabilityService;
    this.VeeamEnterpriseService = VeeamEnterpriseService;

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
      loaderFunction: () => this.VeeamEnterpriseService
        .getSubscriptionInfos(this.serviceName)
        .then(subscriptionInfos => ({
          ...subscriptionInfos,
          data: {
            ...subscriptionInfos.data,
            creation: moment(subscriptionInfos.data.creation).format('LL'),
            expiration: moment(subscriptionInfos.data.expiration).format('LL'),
          },
        })),
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

  activateLicense() {
    this.CucControllerHelper.modal.showModal({
      modalConfig: {
        template: licenseTemplate,
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
        template: licenseTemplate,
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
        template: terminateTemplate,
        controller: 'VeeamEnterpriseTerminateCtrl',
        controllerAs: '$ctrl',
        resolve: {
          serviceName: () => this.serviceName,
        },
      },
    });
  }
}
