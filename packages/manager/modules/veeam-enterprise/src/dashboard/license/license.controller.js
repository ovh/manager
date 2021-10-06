import { VEEAM_PORT } from './license.constants';

export default class VeeamEnterpriseLicenseCtrl {
  /* @ngInject */
  constructor(VeeamEnterpriseService) {
    this.VeeamEnterpriseService = VeeamEnterpriseService;
    this.form = {
      port: VEEAM_PORT,
    };
  }

  dismissModal() {
    this.goToDashboard();
  }

  submitForm(form) {
    if (form.$valid) {
      this.loading = true;
      this.VeeamEnterpriseService.postConfiguration(
        this.action,
        this.serviceName,
        this.form.ip,
        this.form.port,
        this.form.username,
        this.form.password,
      )
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
}
