import angular from 'angular';

import beneficiaryFormTemplate from './beneficiary/form/form.html';
import beneficiaryFormController from './beneficiary/form/form.controller';

import beneficiaryDeleteTemplate from './beneficiary/delete/delete.html';
import beneficiaryDeleteController from './beneficiary/delete/delete.controller';

import { MAX_BENEFICIARIES } from './beneficiaries.constants';
import { buildEnumList } from '../../../sva-wallet.constants';

export default class BeneficiariesController {
  /* @ngInject */
  constructor($translate, $attrs, $uibModal, $scope) {
    this.$translate = $translate;
    this.$attrs = $attrs;
    this.$uibModal = $uibModal;
    this.$scope = $scope;
  }

  $onInit() {
    if (
      angular.isDefined(this.$attrs.editable) &&
      this.$attrs.editable === ''
    ) {
      this.editable = true;
    }

    this.canAddBeneficiaries = this.checkBeneficiaries();

    if (this.editable && this.countryEnum) {
      this.countriesValues = buildEnumList(
        this.countryEnum.filter((countryCode) => countryCode !== 'UNKNOWN'),
        'telephony_billingAccount_svaWallet_kyc_identity_country_',
        this.$translate,
      );
    }

    this.$scope.$watch(
      () => this.representativeIsBeneficiary,
      () => {
        this.canAddBeneficiaries = this.checkBeneficiaries();
      },
    );
  }

  checkBeneficiaries() {
    return this.editable
      ? this.beneficiaries.length + (this.representativeIsBeneficiary ? 1 : 0) <
          MAX_BENEFICIARIES
      : false;
  }

  displaySuccessMessage(type) {
    this.successMessage = this.$translate.instant(
      `telephony_billingAccount_svaWallet_kyc_identity_beneficiaries_success_message_${type}`,
    );
  }

  hideSuccessMessage() {
    this.successMessage = undefined;
  }

  openBeneficiaryForm(beneficiary, mode, hookFn) {
    this.hideSuccessMessage();

    const modalInstance = this.$uibModal.open({
      template: beneficiaryFormTemplate,
      controller: beneficiaryFormController,
      controllerAs: '$ctrl',
      resolve: {
        countryEnum: () => this.countryEnum,
        beneficiary: () => beneficiary,
        mode: () => mode,
      },
    });
    return modalInstance.result
      .then((formBeneficiary) => {
        hookFn(formBeneficiary);
        this.displaySuccessMessage(mode);
      })
      .catch(() => {
        // nothing to do
      });
  }

  addBeneficiary() {
    this.openBeneficiaryForm({}, 'add', (beneficiary) => {
      this.beneficiaries = [...this.beneficiaries, beneficiary];
      this.canAddBeneficiaries = this.checkBeneficiaries();
    });
  }

  editBeneficiary(beneficiary) {
    this.openBeneficiaryForm(
      angular.copy(beneficiary),
      'edit',
      (editedBeneficiary) => {
        this.beneficiaries.splice(
          this.beneficiaries.indexOf(beneficiary),
          1,
          editedBeneficiary,
        );
      },
    );
  }

  deleteBeneficiary(beneficiary) {
    this.hideSuccessMessage();

    const modalInstance = this.$uibModal.open({
      template: beneficiaryDeleteTemplate,
      controller: beneficiaryDeleteController,
      controllerAs: '$ctrl',
    });
    modalInstance.result
      .then(() => {
        this.beneficiaries.splice(this.beneficiaries.indexOf(beneficiary), 1);
        this.canAddBeneficiaries = this.checkBeneficiaries();
        this.displaySuccessMessage('delete');
      })
      .catch(() => {
        // nothing to do
      });
  }
}
