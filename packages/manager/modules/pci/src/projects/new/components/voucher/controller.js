import PciEligibility from '../../classes/eligibility.class';

export default class PciProjectNewVoucherCtrl {
  /* @ngInject */
  constructor($q, pciProjectNew, atInternet) {
    this.$q = $q;
    this.pciProjectNew = pciProjectNew;
    this.atInternet = atInternet;

    // other attributes
    this.formVisible = false;

    this.loading = {
      check: false,
      reset: false,
    };

    this.errors = {
      reset: false,
    };
  }

  /* ==============================
  =            Helpers            =
  =============================== */

  setVoucherFormState() {
    if (this.voucherForm && this.voucherForm.voucher) {
      this.voucherForm.voucher.$setValidity(
        'voucher',
        this.model.voucher.valid,
      );
    }
  }

  isOnOffer() {
    return (
      this.deals.active &&
      this.deals.pattern.test(this.model.voucher.value) &&
      this.model.voucher.valid &&
      this.deals.display.includes('project-creation-voucher')
    );
  }

  getStepTrackingCode() {
    const step = this.steps.find(({ active }) => active);
    return step.name === 'configuration' ? 'config' : step.name;
  }

  canAddVoucher() {
    const { voucher } = this.model;
    const { finalize, isVoucherValidating } = this.globalLoading;

    return (
      !this.loading.check &&
      !finalize &&
      !isVoucherValidating &&
      voucher.value &&
      !voucher.valid
    );
  }

  hasVoucherError() {
    return (
      this.model.voucher.value &&
      !this.model.voucher.valid &&
      this.model.voucher.error
    );
  }

  getFormatCreditText() {
    return `<span class="text-success">${this.voucherEligibility.voucher.credit.text}</span>`;
  }

  submitVoucher() {
    this.loading.check = true;
    this.globalLoading.isVoucherValidating = true;

    return this.checkVoucherValidity(this.model.voucher.value)
      .then((eligibilityOpts) => {
        this.model.isVoucherRequirePaymentMethod =
          eligibilityOpts.voucher.paymentMethodRequired;
        this.model.voucher.setInfos(eligibilityOpts.voucher);
        this.eligibility.setOptions(eligibilityOpts);
        this.setVoucherFormState();

        return eligibilityOpts;
      })
      .then((eligibilityOpts) => {
        if (eligibilityOpts.voucher?.error) {
          return this.$q.reject(eligibilityOpts);
        }

        this.voucherEligibility = new PciEligibility(eligibilityOpts);

        return eligibilityOpts;
      })
      .then((eligibilityOpts) => {
        if (
          !this.model.isVoucherRequirePaymentMethod &&
          !this.defaultPaymentMethod
        ) {
          this.model.paymentMethod = null;
        }

        return this.model.voucher.valid
          ? this.pciProjectNew.setCartProjectItemVoucher(
              this.cart,
              this.model.voucher.value,
            )
          : eligibilityOpts.voucher;
      })
      .catch(() => {
        this.model.isVoucherRequirePaymentMethod = true;
        this.model.voucher.valid = false;
        this.setVoucherFormState();
      })
      .finally(() => {
        this.loading.check = false;
        this.globalLoading.isVoucherValidating = false;

        if (this.hasVoucherError()) {
          this.trackProjectCreationError(
            this.getStepTrackingCode(),
            this.getVoucherError(),
          );
        }
      });
  }

  resetVoucher() {
    this.loading.reset = true;
    this.globalLoading.isVoucherValidating = true;

    return this.pciProjectNew
      .removeCartProjectItemVoucher(this.cart)
      .then(() => {
        this.model.voucher.reset();
        this.model.voucher.setValue('');

        this.voucherEligibility = null;
        this.errors.reset = false;
        this.model.isVoucherRequirePaymentMethod = true;
      })
      .catch(() => {
        this.errors.reset = true;
        this.trackProjectCreationError(
          this.getStepTrackingCode(),
          'pci_projects_new_voucher_form_reset_error',
        );
      })
      .finally(() => {
        this.loading.reset = false;
        this.globalLoading.isVoucherValidating = false;
      });
  }

  manageResetVoucher() {
    if (!this.model.voucher.value) {
      this.model.voucher.reset();
      this.voucherForm.voucher.$setValidity('voucher', true);
    }
  }

  getVoucherError() {
    return `pci_projects_new_voucher_form_field_error_${this.model.voucher.error.statusText.toLowerCase()}`;
  }

  /* -----  End of Helpers  ------ */

  /* =============================
  =            Events            =
  ============================== */

  onVoucherFormSubmit() {
    return this.submitVoucher();
  }

  onVoucherFormReset() {
    return this.resetVoucher();
  }

  onAddVoucherBtnClick() {
    this.formVisible = true;
  }

  onVoucherInputChange() {
    this.manageResetVoucher();
  }

  onVoucherInputLeave() {
    if (this.model.voucher.value && this.canAddVoucher()) {
      return this.submitVoucher();
    }

    return this.manageResetVoucher();
  }

  /* -----  End of Events  ------ */

  /* ============================
  =            Hooks            =
  ============================= */

  $onInit() {
    const { value, valid } = this.model.voucher;

    if (value) {
      if (valid) {
        this.voucherEligibility = this.eligibility;
      } else {
        this.model.voucher.setValue('');
      }

      this.formVisible = true;
      this.setVoucherFormState();
    }
  }

  /* -----  End of Hooks  ------ */
}
