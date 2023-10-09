export default class VeeamEnterpriseLicenseCtrl {
  /* @ngInject */
  constructor(VeeamEnterpriseService) {
    this.VeeamEnterpriseService = VeeamEnterpriseService;
    this.form = {};
  }

  dismissModal() {
    this.trackClick(this.getLicenseTag('cancel'));
    this.goToDashboard();
  }

  submitForm(form) {
    if (form.$valid) {
      this.trackClick(this.getLicenseTag('confirm'));
      this.loading = true;
      this.VeeamEnterpriseService.postConfiguration(
        this.action,
        this.serviceName,
        this.form.ip,
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

  getLicenseTag(hit) {
    return this.action === 'register'
      ? `license::activate::${hit}`
      : `license::update::${hit}`;
  }
}
