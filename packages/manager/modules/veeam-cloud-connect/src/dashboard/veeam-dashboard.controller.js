import get from 'lodash/get';

import storageAddTemplate from '../storage/add/veeam-storage-add.html';
import updateOfferTemplate from './update-offer/veeam-update-offer.html';
import storageAddCtrl from '../storage/add/veeam-storage-add.controller';
import updateOfferCtrl from './update-offer/veeam-update-offer.controller';

import { REDIRECT_URLS } from '../constants';

export default class VeeamCloudConnectDashboardCtrl {
  /* @ngInject */
  constructor($stateParams, $translate, coreConfig, CucControllerHelper,
    CucFeatureAvailabilityService, CucRegionService, VeeamCloudConnectService) {
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.coreConfig = coreConfig;
    this.CucControllerHelper = CucControllerHelper;
    this.CucFeatureAvailabilityService = CucFeatureAvailabilityService;
    this.CucRegionService = CucRegionService;
    this.VeeamCloudConnectService = VeeamCloudConnectService;

    this.serviceName = this.$stateParams.serviceName;

    this.initLoaders();
    this.initActions();
  }

  initLoaders() {
    const errorHandler = response => this.VeeamCloudConnectService.unitOfWork.messages.push({
      text: response.message,
      type: 'error',
    });

    this.configurationInfos = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () => this.VeeamCloudConnectService.getConfigurationInfos(this.serviceName),
      successHandler: () => this.getRegion(this.configurationInfos.data.location
        .macroRegion.code),
      errorHandler,
    });

    this.subscriptionInfos = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () => this.VeeamCloudConnectService.getSubscriptionInfos(this.serviceName),
      successHandler: () => {
        if (this.subscriptionInfos.data.isOnTrial) {
          let message = this.$translate.instant('veeam_tiles_subscription_label_renewal_warning', { remainingDays: this.subscriptionInfos.data.subscriptionTimeRemaining });
          if (this.subscriptionInfos.data.subscriptionTimeRemaining < 0) {
            message = this.$translate.instant('veeam_message_product_disabled');
          }

          this.VeeamCloudConnectService.unitOfWork.messages.push({
            text: message,
            type: this.subscriptionInfos.data.subscriptionTimeRemaining < 0 ? 'error' : 'warning',
            link: {
              type: 'action',
              text: this.$translate.instant('veeam_tiles_subscription_label_renewal_warning_link'),
              action: () => this.changeOffer(),
            },
          });
        }
      },
      errorHandler,
    });

    this.actions = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () => this.VeeamCloudConnectService.getActions(this.$stateParams.serviceName),
    });

    this.orderableOffers = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () => this.VeeamCloudConnectService.getOrderableOffers(this.serviceName),
      errorHandler,
    });
  }

  initActions() {
    this.uiActions = {
      changeOffer: {
        text: this.$translate.instant('veeam_common_edit'),
        callback: () => this.changeOffer(),
        isAvailable: () => !this.actions.loading && this.actions.data.upgradeOffer.available,
      },
      manageAutorenew: {
        text: this.$translate.instant('veeam_common_manage'),
        href: this.CucControllerHelper.navigation.constructor.getUrl(get(REDIRECT_URLS[this.coreConfig.getRegion()], 'renew'), { serviceName: this.serviceName, serviceType: 'VEEAM_CLOUD_CONNECT' }),
        isAvailable: () => true,
      },
      manageContact: {
        text: this.$translate.instant('veeam_common_manage'),
        href: this.CucControllerHelper.navigation.constructor.getUrl(get(REDIRECT_URLS[this.coreConfig.getRegion()], 'contacts'), { serviceName: this.serviceName }),
        isAvailable: () => this.CucFeatureAvailabilityService.hasFeature('CONTACTS', 'manage'),
      },
    };
  }

  $onInit() {
    this.configurationInfos.load();
    this.subscriptionInfos.load();
    this.actions.load();
    this.orderableOffers.load();
  }

  addStorage() {
    if (this.actions.data.addStorage.available) {
      this.CucControllerHelper.modal
        .showModal({
          modalConfig: {
            template: storageAddTemplate,
            controller: storageAddCtrl,
            controllerAs: 'VeeamCloudConnectStorageAddCtrl',
            resolve: {
              serviceName: () => this.serviceName,
            },
          },
        })
        .then(result => this.VeeamCloudConnectService.startPolling(
          this.$stateParams.serviceName,
          result.data,
        ))
        .catch(err => this.VeeamCloudConnectService.unitOfWork.messages.push({
          text: err.message,
          type: 'error',
        }));
    } else {
      this.CucControllerHelper.modal.showWarningModal({
        title: this.$translate.instant('veeam_common_action_unavailable'),
        message: this.actions.data.addStorage.reason,
      });
    }
  }

  changeOffer() {
    if (this.actions.data.upgradeOffer.available) {
      this.CucControllerHelper.modal.showModal({
        modalConfig: {
          template: updateOfferTemplate,
          controller: updateOfferCtrl,
          controllerAs: 'VeeamCloudConnectUpdateOfferCtrl',
          resolve: {
            serviceName: () => this.serviceName,
          },
        },
      })
        .then(result => this.VeeamCloudConnectService.unitOfWork.messages.push({
          textHtml: result.message,
          type: 'success',
        }))
        .catch(err => this.VeeamCloudConnectService.unitOfWork.messages.push({
          text: err.message,
          type: 'error',
        }));
    } else {
      this.CucControllerHelper.modal.showWarningModal({
        title: this.$translate.instant('veeam_common_action_unavailable'),
        message: this.actions.data.upgradeOffer.reason,
      });
    }
  }

  getRegion(region) {
    this.region = this.CucRegionService.getRegion(region);
  }

  static formatDate(date) {
    return moment(date).format('LL');
  }
}
