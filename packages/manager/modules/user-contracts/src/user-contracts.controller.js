import map from 'lodash/map';
import size from 'lodash/size';

export default class UserContractsCtrl {
  /* @ngInject */
  constructor($translate, $state, userContractsService) {
    this.$translate = $translate;
    this.$state = $state;
    this.userContractsService = userContractsService;
    this.model = {
      accepted: {
        value: false,
      },
    };
  }

  $onInit() {
    this.contracts = this.$state.params.contracts;
  }

  getCheckboxLabel() {
    const codes = map(this.contracts, 'code');
    if (size(codes) > 1) {
      return this.$translate.instant('user_contracts_checkbox_label_both');
    }
    return this.$translate.instant(`user_contracts_checkbox_label_${codes[0]}`);
  }

  agree() {
    this.saving = true;
    this.hasSubmitError = false;
    this.userContractsService
      .acceptAgreements(this.contracts)
      .then(() => this.$state.go(this.from))
      .catch(() => {
        this.model.accepted.value = false;
        this.hasSubmitError = true;
      })
      .finally(() => {
        this.saving = false;
      });
  }
}
