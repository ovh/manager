export default class VeeamEnterpriseLicenseCtrl {
  /* @ngInject */
  constructor($uibModalInstance, action, serviceName, VeeamEnterpriseService) {
    this.$uibModalInstance = $uibModalInstance;
    this.action = action;
    this.serviceName = serviceName;
    this.VeeamEnterpriseService = VeeamEnterpriseService;

    this.form = {};
  }

  dismissModal() {
    this.$uibModalInstance.dismiss('cancel');
  }

  submitForm(form) {
    if (form.$valid) {
      this.loading = true;
      this.VeeamEnterpriseService
        .postConfiguration(
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
        .finally(() => this.$uibModalInstance.close());
    }
  }
}
