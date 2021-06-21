import includes from 'lodash/includes';
import map from 'lodash/map';
import size from 'lodash/size';

export default class UserContractsAcceptModalCtrl {
  /* @ngInject */
  constructor($scope, $translate, ContractService) {
    this.$scope = $scope;
    this.ContractService = ContractService;
    this.$translate = $translate;

    this.model = {
      accepted: {
        value: false,
      },
    };

    this.contracts = {
      loading: false,
      load: () => {
        this.contracts.loading = true;
        this.ContractService.getAgreementsToValidate((contract) =>
          includes(['tos', 'pp'], contract.code),
        )
          .then((contracts) => {
            this.contracts.data = contracts;
          })
          .finally(() => {
            this.contracts.loading = false;
          });
      },
      data: [],
    };
  }

  $onInit() {
    return this.contracts.load();
  }

  agree() {
    this.saving = true;
    this.hasSubmitError = false;
    this.ContractService.acceptAgreements(this.contracts.data)
      .then(() => $('#user-contracts-currentAction').modal('hide'))
      .catch(() => {
        this.model.accepted.value = false;
        this.hasSubmitError = true;
      })
      .finally(() => {
        this.saving = false;
      });
  }

  getCheckboxLabel() {
    const codes = map(this.contracts.data, 'code');
    if (size(codes) > 1) {
      return this.$translate.instant(
        'user_contracts_modal_checkbox_label_both',
      );
    }
    return this.$translate.instant(
      `user_contracts_modal_checkbox_label_${codes[0]}`,
    );
  }
}
