import get from 'lodash/get';

(() => {
  class VeeamDashboardCtrl {
    constructor($stateParams, $translate, CucControllerHelper, CucFeatureAvailabilityService,
      CucRegionService, VeeamService, REDIRECT_URLS) {
      this.$stateParams = $stateParams;
      this.$translate = $translate;
      this.CucControllerHelper = CucControllerHelper;
      this.CucFeatureAvailabilityService = CucFeatureAvailabilityService;
      this.CucRegionService = CucRegionService;
      this.VeeamService = VeeamService;
      this.REDIRECT_URLS = REDIRECT_URLS;

      this.serviceName = this.$stateParams.serviceName;

      this.initLoaders();
      this.initActions();
    }

    initLoaders() {
      const errorHandler = response => this.VeeamService.unitOfWork.messages.push({
        text: response.message,
        type: 'error',
      });

      this.configurationInfos = this.CucControllerHelper.request.getHashLoader({
        loaderFunction: () => this.VeeamService.getConfigurationInfos(this.serviceName),
        successHandler: () => this.getRegion(this.configurationInfos.data.location
          .macroRegion.code),
        errorHandler,
      });

      this.subscriptionInfos = this.CucControllerHelper.request.getHashLoader({
        loaderFunction: () => this.VeeamService.getSubscriptionInfos(this.serviceName),
        successHandler: () => {
          if (this.subscriptionInfos.data.isOnTrial) {
            let message = this.$translate.instant('veeam_tiles_subscription_label_renewal_warning', { remainingDays: this.subscriptionInfos.data.subscriptionTimeRemaining });
            if (this.subscriptionInfos.data.subscriptionTimeRemaining < 0) {
              message = this.$translate.instant('veeam_message_product_disabled');
            }

            this.VeeamService.unitOfWork.messages.push({
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
        loaderFunction: () => this.VeeamService.getActions(this.$stateParams.serviceName),
      });

      this.orderableOffers = this.CucControllerHelper.request.getArrayLoader({
        loaderFunction: () => this.VeeamService.getOrderableOffers(this.serviceName),
        errorHandler,
      });
    }

    initActions() {
      this.uiActions = {
        changeOffer: {
          text: this.$translate.instant('common_edit'),
          callback: () => this.changeOffer(),
          isAvailable: () => !this.actions.loading && this.actions.data.upgradeOffer.available,
        },
        manageAutorenew: {
          text: this.$translate.instant('common_manage'),
          href: this.CucControllerHelper.navigation.constructor.getUrl(get(this.REDIRECT_URLS, 'renew'), { serviceName: this.serviceName, serviceType: 'VEEAM_CLOUD_CONNECT' }),
          isAvailable: () => true,
        },
        manageContact: {
          text: this.$translate.instant('common_manage'),
          href: this.CucControllerHelper.navigation.constructor.getUrl(get(this.REDIRECT_URLS, 'contacts'), { serviceName: this.serviceName }),
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
              templateUrl: 'app/veeam/storage/add/veeam-storage-add.html',
              controller: 'VeeamStorageAddCtrl',
              controllerAs: 'VeeamStorageAddCtrl',
              resolve: {
                serviceName: () => this.serviceName,
              },
            },
          })
          .then(result => this.VeeamService.startPolling(
            this.$stateParams.serviceName,
            result.data,
          ))
          .catch(err => this.VeeamService.unitOfWork.messages.push({
            text: err.message,
            type: 'error',
          }));
      } else {
        this.CucControllerHelper.modal.showWarningModal({
          title: this.$translate.instant('common_action_unavailable'),
          message: this.actions.data.addStorage.reason,
        });
      }
    }

    changeOffer() {
      if (this.actions.data.upgradeOffer.available) {
        this.CucControllerHelper.modal.showModal({
          modalConfig: {
            templateUrl: 'app/veeam/dashboard/update-offer/veeam-update-offer.html',
            controller: 'VeeamUpdateOfferCtrl',
            controllerAs: 'VeeamUpdateOfferCtrl',
            resolve: {
              serviceName: () => this.serviceName,
            },
          },
        })
          .then(result => this.VeeamService.unitOfWork.messages.push({
            textHtml: result.message,
            type: 'success',
          }))
          .catch(err => this.VeeamService.unitOfWork.messages.push({
            text: err.message,
            type: 'error',
          }));
      } else {
        this.CucControllerHelper.modal.showWarningModal({
          title: this.$translate.instant('common_action_unavailable'),
          message: this.actions.data.upgradeOffer.reason,
        });
      }
    }

    getRegion(region) {
      this.region = this.CucRegionService.getRegion(region);
    }
  }

  angular.module('managerApp').controller('VeeamDashboardCtrl', VeeamDashboardCtrl);
})();
