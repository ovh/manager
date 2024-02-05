import PciEligibility from '../../classes/eligibility.class';
import { DISCOVERY_PROMOTION_VOUCHER } from '../../../project/project.constants';

export default class PciProjectNewVoucherCtrl {
  /* @ngInject */
  constructor($q, $timeout, pciProjectNew) {
    this.$q = $q;
    this.$timeout = $timeout;
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
    const step = this.steps?.find(({ active }) => active);
    if (!step) {
      return '';
    }
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
    this.trackClick(`${this.viewOptions.trackingPrefix}confirm_voucher`);

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
        this.clearVoucher();
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

  clearVoucher() {
    this.model.voucher.reset();
    this.model.voucher.setValue('');
    this.model.voucher.valid = false;
    this.voucherEligibility = null;
    this.errors.reset = false;
    this.model.isVoucherRequirePaymentMethod = true;
    this.voucherForm.voucher.$setValidity('voucher', true);
    this.voucherForm.voucher.$setPristine();
  }

  manageResetVoucher() {
    if (!this.model.voucher.value) {
      this.model.voucher.reset();
      this.voucherForm.voucher.$setValidity('voucher', true);
    }
  }

  getVoucherError() {
    const errorCode = this.model.voucher.error?.statusText
      ?.match(/(VOUCHER_\w+)/)?.[1]
      .toLowerCase();
    return `pci_projects_new_voucher_form_field_error_${errorCode ||
      'invalid'}`;
  }

  /* -----  End of Helpers  ------ */

  /* =============================
  =            Events            =
  ============================== */

  onVoucherFormSubmit() {
    return this.submitVoucher();
  }

  onVoucherFormReset() {
    this.trackClick(`${this.viewOptions.trackingPrefix}::delete_voucher`);
    return this.resetVoucher();
  }

  onAddVoucherBtnClick() {
    this.formVisible = true;
    this.trackClick(`${this.viewOptions.trackingPrefix}::add_voucher`);
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
    this.formVisible = !this.viewOptions.foldVoucher;
    const { value, valid } = this.model.voucher;

    if (value) {
      if (valid) {
        this.voucherEligibility = this.eligibility;
      }
      this.formVisible = true;
      this.$timeout(() => this.setVoucherFormState());
    } else if (this.isDiscoveryProject) {
      this.model.voucher.value = DISCOVERY_PROMOTION_VOUCHER;
      this.submitVoucher().then(() => {
        if (!this.model.voucher.valid) {
          this.clearVoucher();
        }
      });
    }
  }

  /* -----  End of Hooks  ------ */
}
