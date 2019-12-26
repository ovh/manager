import filter from 'lodash/filter';
import findLast from 'lodash/findLast';
import get from 'lodash/get';

(() => {
  class CloudProjectComputeInfrastructureVirtualmachineRescueCtrl {
    constructor(
      $scope,
      $stateParams,
      $uibModalInstance,
      $translate,
      params,
      CucCloudMessage,
      CloudProjectComputeInfrastructureOrchestrator,
      OvhApiCloudProjectImage,
      CucServiceHelper,
    ) {
      this.$scope = $scope;
      this.$stateParams = $stateParams;
      this.$uibModalInstance = $uibModalInstance;
      this.$translate = $translate;
      this.params = params;
      this.CucCloudMessage = CucCloudMessage;
      this.CloudProjectComputeInfrastructureOrchestrator = CloudProjectComputeInfrastructureOrchestrator;
      this.OvhApiCloudProjectImage = OvhApiCloudProjectImage;
      this.CucServiceHelper = CucServiceHelper;
    }

    $onInit() {
      this.data = {
        vm: this.params,
        images: null,
        selectedImage: null,
      };
      this.loaders = {
        action: false,
        images: false,
      };

      this.getImages();
    }

    rescueMode(enable) {
      this.loaders.action = true;
      return this.CloudProjectComputeInfrastructureOrchestrator.rescueVm(
        this.data.vm,
        enable,
        this.data.selectedImage,
      )
        .then((result) => {
          const typeKey =
            !this.data.selectedImage || this.data.vm.image.type === 'linux'
              ? 'linux'
              : 'windows';
          const pwdKey = this.data.selectedImage ? '' : 'pwd_';
          const user = this.data.selectedImage
            ? this.data.selectedImage.user
            : 'root';
          const messageName = `cpc_rescue_mode_success_${pwdKey}${typeKey}`;
          this.CucCloudMessage.info({
            textHtml: this.$translate.instant(messageName, {
              vmName: this.data.vm.name,
              user,
              ip: this.data.vm.ipAddresses[0].ip,
              pwd: get(result, 'adminPassword', ''),
            }),
          });
        })
        .catch(this.CucServiceHelper.errorHandler('cpc_rescue_mode_error'))
        .finally(() => {
          this.loaders.action = false;
          this.$uibModalInstance.close();
        });
    }

    cancel() {
      this.$uibModalInstance.dismiss();
    }

    static isNonRescuableWithDefaultImage(vm) {
      return (
        vm.image &&
        (vm.image.distribution === 'freebsd' || vm.image.type === 'windows')
      );
    }

    getImages() {
      this.loaders.images = true;

      return this.OvhApiCloudProjectImage.v6()
        .query({
          serviceName: this.$stateParams.projectId,
          flavorType: this.data.vm.type,
          region: this.data.vm.region,
        })
        .$promise.then((result) => {
          this.data.images = filter(result, {
            visibility: 'public',
            type: this.data.vm.image ? this.data.vm.image.type : 'linux',
          });
          if (this.constructor.isNonRescuableWithDefaultImage(this.data.vm)) {
            this.data.selectedImage = findLast(this.data.images, {
              nameGeneric: this.data.vm.image.nameGeneric,
            });
          }
        })
        .finally(() => {
          this.loaders.images = false;
        });
    }
  }

  angular
    .module('managerApp')
    .controller(
      'CloudProjectComputeInfrastructureVirtualmachineRescueCtrl',
      CloudProjectComputeInfrastructureVirtualmachineRescueCtrl,
    );
})();
