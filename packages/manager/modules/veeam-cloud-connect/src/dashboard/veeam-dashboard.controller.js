import 'moment';

import { RENEW_URLS } from '../details/constants';

export default class VeeamCloudConnectDashboardCtrl {
  /* @ngInject */
  constructor(
    $stateParams,
    $translate,
    coreConfig,
    coreURLBuilder,
    CucControllerHelper,
    CucFeatureAvailabilityService,
    ovhManagerRegionService,
    VeeamCloudConnectService,
  ) {
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.coreConfig = coreConfig;
    this.coreURLBuilder = coreURLBuilder;
    this.CucControllerHelper = CucControllerHelper;
    this.CucFeatureAvailabilityService = CucFeatureAvailabilityService;
    this.ovhManagerRegionService = ovhManagerRegionService;
    this.VeeamCloudConnectService = VeeamCloudConnectService;

    this.serviceName = this.$stateParams.serviceName;

    this.initLoaders();
    this.initActions();
  }

  initLoaders() {
    const errorHandler = (response) =>
      this.VeeamCloudConnectService.unitOfWork.messages.push({
        text: response.message,
        type: 'error',
      });

    this.configurationInfos = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.VeeamCloudConnectService.getConfigurationInfos(this.serviceName),
      successHandler: () =>
        this.getRegion(this.configurationInfos.data.location.macroRegion.code),
      errorHandler,
    });

    this.subscriptionInfos = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.VeeamCloudConnectService.getSubscriptionInfos(this.serviceName),
      successHandler: () => {
        if (this.subscriptionInfos.data.isOnTrial) {
          let message = this.$translate.instant(
            'veeam_tiles_subscription_label_renewal_warning',
            {
              remainingDays: this.subscriptionInfos.data
                .subscriptionTimeRemaining,
            },
          );
          if (this.subscriptionInfos.data.subscriptionTimeRemaining < 0) {
            message = this.$translate.instant('veeam_message_product_disabled');
          }

          this.VeeamCloudConnectService.unitOfWork.messages.push({
            text: message,
            type:
              this.subscriptionInfos.data.subscriptionTimeRemaining < 0
                ? 'error'
                : 'warning',
            link: {
              type: 'action',
              text: this.$translate.instant(
                'veeam_tiles_subscription_label_renewal_warning_link',
              ),
              action: () => this.changeOffer(),
            },
          });
        }
      },
      errorHandler,
    });

    this.actions = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () =>
        this.VeeamCloudConnectService.getActions(this.$stateParams.serviceName),
    });

    this.orderableOffers = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () =>
        this.VeeamCloudConnectService.getOrderableOffers(this.serviceName),
      errorHandler,
    });
  }

  initActions() {
    this.uiActions = {
      changeOffer: {
        text: this.$translate.instant('veeam_common_edit'),
        callback: () => this.changeOffer(),
        isAvailable: () =>
          !this.actions.loading && this.actions.data.upgradeOffer.available,
      },
      manageAutorenew: {
        text: this.$translate.instant('veeam_common_manage'),
        href: this.coreConfig.isRegion('EU')
          ? this.coreURLBuilder.buildURL('dedicated', '#/billing/autoRenew', {
              searchText: this.serviceName,
              selectedType: 'VEEAM_CLOUD_CONNECT',
            })
          : RENEW_URLS[this.coreConfig.getRegion()],

        isAvailable: () => true,
      },
      manageContact: {
        text: this.$translate.instant('veeam_common_manage'),
        href: this.coreConfig.isRegion('EU')
          ? this.coreURLBuilder.buildURL('dedicated', '#/contacts/services', {
              serviceName: this.serviceName,
              tab: 'SERVICES',
            })
          : null,
        isAvailable: () =>
          this.CucFeatureAvailabilityService.hasFeature('CONTACTS', 'manage'),
      },
    };
  }

  $onInit() {
    this.configurationInfos.load();
    this.subscriptionInfos.load();
    this.actions.load();
    this.orderableOffers.load();
  }

  changeOffer() {
    this.goToOfferChange();
  }

  getRegion(region) {
    this.region = this.ovhManagerRegionService.getRegion(region);
  }

  static formatDate(date) {
    return moment(date).format('LL');
  }
}
