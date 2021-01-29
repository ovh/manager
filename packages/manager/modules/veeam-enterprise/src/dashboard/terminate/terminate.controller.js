export default class VeeamEnterpriseTerminateCtrl {
  /* @ngInject */
  constructor(atInternet, VeeamEnterpriseService) {
    this.atInternet = atInternet;
    this.VeeamEnterpriseService = VeeamEnterpriseService;
  }

  dismissModal() {
    this.goToDashboard();
  }

  terminate() {
    this.atInternet.trackClick({
      name: 'veeam-enterprise::dashboard::license::terminate::confirm',
      type: 'action',
    });
    this.loading = true;
    this.VeeamEnterpriseService.terminate(this.serviceName)
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
