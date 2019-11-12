export default class VeeamEnterpriseTerminateCtrl {
  /* @ngInject */
  constructor($uibModalInstance, serviceName, VeeamEnterpriseService) {
    this.$uibModalInstance = $uibModalInstance;
    this.serviceName = serviceName;
    this.VeeamEnterpriseService = VeeamEnterpriseService;
  }

  dismissModal() {
    this.$uibModalInstance.dismiss('cancel');
  }

  terminate() {
    this.loading = true;
    this.VeeamEnterpriseService
      .terminate(this.serviceName)
      .then((response) => {
        this.VeeamEnterpriseService.unitOfWork.messages.push({
          text: response.message,
          type: 'success',
        });
      })
      .catch((response) => {
        this.VeeamEnterpriseService.unitOfWork.messages.push({
          text: response.message,
          type: 'error',
        });
      })
      .finally(() => this.$uibModalInstance.close());
  }
}
