export default class CucNameChangeModalCtrl {
  /* @ngInject */
  constructor($uibModalInstance, params, CucControllerHelper) {
    this.$uibModalInstance = $uibModalInstance;

    this.params = params;
    this.CucControllerHelper = CucControllerHelper;
  }

  $onInit() {
    this.serviceName = this.params.serviceName;

    this.model = {
      displayName: {
        value: null,
        maxlength: this.params.maxlength || Infinity,
      },
    };

    this.model.displayName.value = this.params.displayName;
  }

  confirm() {
    this.saving = true;

    if (this.params.onSave) {
      return this.params.onSave(this.model.displayName.value, this.serviceName)
        .then((response) => this.$uibModalInstance.close(response))
        .catch((response) => this.$uibModalInstance.dismiss(response))
        .finally(() => {
          this.saving = false;
        });
    }

    return this.$uibModalInstance.close(this.model.displayName.value);
  }

  cancel() {
    this.$uibModalInstance.dismiss();
  }

  isModalLoading() {
    return this.saving;
  }
}
