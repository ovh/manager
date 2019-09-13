(() => {
  class VeeamStorageCtrl {
    constructor($stateParams, $translate, CucControllerHelper, CucRegionService, VeeamService) {
      this.$stateParams = $stateParams;
      this.$translate = $translate;
      this.CucControllerHelper = CucControllerHelper;
      this.CucRegionService = CucRegionService;
      this.VeeamService = VeeamService;

      this.storageInfos = CucControllerHelper.request.getArrayLoader({
        loaderFunction: () => this.VeeamService.getStorages(this.$stateParams.serviceName),
        errorHandler: response => this.VeeamService.unitOfWork.messages.push({
          text: response.message,
          type: 'error',
        }),
      });

      this.actions = this.CucControllerHelper.request.getArrayLoader({
        loaderFunction: () => this.VeeamService.getActions(this.$stateParams.serviceName),
      });

      this.capabilities = this.CucControllerHelper.request.getHashLoader({
        loaderFunction: () => this.VeeamService.getCapabilities(this.$stateParams.serviceName),
      });
    }

    getRegionText(region) {
      return this.CucRegionService.getTranslatedMicroRegion(region.toUpperCase());
    }

    addStorage() {
      if (this.actions.data.addStorage.available) {
        this.CucControllerHelper.modal.showModal({
          modalConfig: {
            templateUrl: 'app/veeam/storage/add/veeam-storage-add.html',
            controller: 'VeeamStorageAddCtrl',
            controllerAs: 'VeeamStorageAddCtrl',
            resolve: {
              serviceName: () => this.$stateParams.serviceName,
            },
          },
        })
          .then((result) => {
            this.VeeamService.startPolling(this.$stateParams.serviceName, result.data)
              .then(this.storageInfos.load.bind(this));
          })
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

    updateQuota(inventoryName) {
      this.CucControllerHelper.modal.showModal({
        modalConfig: {
          templateUrl: 'app/veeam/storage/update-quota/veeam-storage-update-quota.html',
          controller: 'VeeamStorageUpdateQuotaCtrl',
          controllerAs: 'VeeamStorageUpdateQuotaCtrl',
          resolve: {
            inventoryName: () => inventoryName,
            serviceName: () => this.$stateParams.serviceName,
          },
        },
      })
        .then((result) => {
          this.VeeamService.startPolling(this.$stateParams.serviceName, result.data)
            .then(this.storageInfos.load.bind(this));
        })
        .catch(error => this.VeeamService.unitOfWork.messages.push({
          text: error.message,
          type: 'error',
        }));
    }

    $onInit() {
      this.storageInfos.load();
      this.actions.load();
      this.capabilities.load();
    }
  }

  angular.module('managerApp').controller('VeeamStorageCtrl', VeeamStorageCtrl);
})();
