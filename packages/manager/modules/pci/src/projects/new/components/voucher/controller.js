export default class PciProjectNewVoucherCtrl {
  /* @ngInject */
  constructor(pciProjectNew) {
    this.pciProjectNew = pciProjectNew;

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

  /* -----  End of Helpers  ------ */

  /* =============================
  =            Events            =
  ============================== */

  onAddVoucherBtnClick() {
    this.formVisible = true;
  }

  onVoucherFormSubmit() {
    this.loading.check = true;

    return this.checkVoucherValidity(this.model.voucher.value)
      .then((eligibilityOpts) => {
        this.model.voucher.setInfos(eligibilityOpts.voucher);
        this.setVoucherFormState();

        this.eligibility.setOptions(eligibilityOpts);

        return this.model.voucher.valid
          ? this.pciProjectNew.setCartProjectItemVoucher(
              this.cart,
              this.model.voucher.value,
            )
          : eligibilityOpts.voucher;
      })
      .catch(() => {
        this.model.voucher.valid = false;
        this.setVoucherFormState();
      })
      .finally(() => {
        this.loading.check = false;

        if (this.hasVoucherError()) {
          this.trackProjectCreationError(
            this.getStepTrackingCode(),
            this.getVoucherError(),
          );
        }
      });
  }

  hasVoucherError() {
    return (
      this.model.voucher.value &&
      !this.model.voucher.valid &&
      this.model.voucher.error
    );
  }

  getVoucherError() {
    return `pci_projects_new_voucher_form_field_error_${this.model.voucher.error.statusText.toLowerCase()}`;
  }

  onVoucherFormReset() {
    this.loading.reset = true;

    this.pciProjectNew
      .removeCartProjectItemVoucher(this.cart)
      .then(() => {
        this.model.voucher.reset();
        this.errors.reset = false;
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
      });
  }

  /* -----  End of Events  ------ */

  /* ============================
  =            Hooks            =
  ============================= */

  $onInit() {
    if (this.model.voucher.value) {
      this.formVisible = true;
      this.setVoucherFormState();
    }
  }

  /* -----  End of Hooks  ------ */
}
