export default class {
  /* @ngInject */
  constructor($uibModalInstance, params) {
    const { domain, model, rules } = params;
    this.modal = $uibModalInstance;

    this.domain = domain;
    this.model = model;
    this.rules = rules;
  }

  $onInit() {
    if (!this.domain) {
      this.goBack();
    }
  }

  primaryAction() {
    this.modal.dismiss(false);
  }

  secondaryAction() {
    this.modal.close(true);
  }
}
