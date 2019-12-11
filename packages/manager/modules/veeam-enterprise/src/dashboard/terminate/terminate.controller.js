export default class VeeamEnterpriseTerminateCtrl {
  /* @ngInject */
  constructor(VeeamEnterpriseService) {
    this.VeeamEnterpriseService = VeeamEnterpriseService;
  }

  dismissModal() {
    this.goToDashboard();
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
      .finally(() => this.goToDashboard());
  }
}
