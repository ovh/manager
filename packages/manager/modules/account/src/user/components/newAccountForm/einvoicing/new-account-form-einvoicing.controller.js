import {
  FR_COUNTRIES,
  USER_TYPE_ENTERPRISE,
  USER_TYPE_ASSOCIATION,
  USER_TYPE_ADMINISTRATION,
} from '../new-account-form-component.constants';

// B2B = corporation / association ; B2G = administration.
const B2G_LEGAL_FORMS = [USER_TYPE_ADMINISTRATION];
const ELIGIBLE_LEGAL_FORMS = [
  USER_TYPE_ENTERPRISE,
  USER_TYPE_ASSOCIATION,
  USER_TYPE_ADMINISTRATION,
];

const SIRET_REGEX = /^\d{14}$/;

/**
 * E-invoicing billing address field (PPF directory), FR B2B/B2G only. Purely
 * presentational: `rule` is the `einvoicingBillingAddress` entry of the parent
 * form's /newAccount/rules response — no API call here. SIRET edits happen
 * inside the siret component and bypass the parent's onFieldChange, hence
 * `onRefreshRules`.
 */
export default class NewAccountFormEinvoicingController {
  /* @ngInject */
  constructor($scope) {
    this.$scope = $scope;
    this.staleAddress = false;
  }

  $onInit() {
    this.$scope.$on('einvoicing.staleAddress', () => {
      this.staleAddress = true;
      this.model.einvoicingBillingAddress = null;
      this.syncSelectedAddress();
    });
  }

  $onChanges(changes) {
    if (changes.siret || changes.legalForm || changes.country) {
      this.staleAddress = false;
    }
    if (changes.siret && !changes.siret.isFirstChange()) {
      if (this.isEligible()) {
        // the parent's rules were fetched with the previous SIRET
        this.onRefreshRules();
      } else if (this.model.einvoicingBillingAddress) {
        // SIRET no longer complete: the current selection can't be trusted
        this.model.einvoicingBillingAddress = null;
        this.syncSelectedAddress();
      }
    }
    if (changes.rule) {
      if (this.rule) {
        this.syncModelValue();
      } else {
        // entry gone: the parent's updateRules already dropped the model value
        this.selectedAddress = null;
      }
    }
  }

  isEligible() {
    return (
      FR_COUNTRIES.includes(this.country) &&
      ELIGIBLE_LEGAL_FORMS.includes(this.legalForm) &&
      !!this.siret &&
      SIRET_REGEX.test(this.siret)
    );
  }

  // isEligible() hides a stale rule entry while the SIRET is being edited
  isVisible() {
    return !!this.rule && this.isEligible();
  }

  isB2g() {
    return B2G_LEGAL_FORMS.includes(this.legalForm);
  }

  getAddresses() {
    return (this.rule && this.rule.in) || [];
  }

  isEmpty() {
    return this.getAddresses().length === 0;
  }

  hasSingleAddress() {
    return this.getAddresses().length === 1;
  }

  hasMultipleAddresses() {
    return this.getAddresses().length > 1;
  }

  getSingleAddress() {
    const addresses = this.getAddresses();
    return (
      (this.rule && this.rule.defaultValue) ||
      (addresses.length === 1 ? addresses[0] : null)
    );
  }

  syncModelValue() {
    if (this.isEmpty()) {
      this.model.einvoicingBillingAddress = null;
    } else if (this.hasSingleAddress()) {
      this.model.einvoicingBillingAddress = this.getSingleAddress();
    } else if (
      this.model.einvoicingBillingAddress &&
      !this.getAddresses().includes(this.model.einvoicingBillingAddress)
    ) {
      this.model.einvoicingBillingAddress = null;
    }
    this.syncSelectedAddress();
  }

  // memoized on the source array: a fresh array each digest would make
  // oui-select's items watcher loop ($rootScope:infdig)
  getAddressItems() {
    const addresses = this.getAddresses();
    if (this.addressItemsSource !== addresses) {
      this.addressItemsSource = addresses;
      this.addressItems = addresses.map((address) => ({
        value: address,
        label: address,
      }));
    }
    return this.addressItems;
  }

  // oui-select binds an item object; mirror the scalar model value (the value
  // saved on submit) to it
  syncSelectedAddress() {
    const value = this.model.einvoicingBillingAddress;
    this.selectedAddress =
      (value && this.getAddressItems().find((item) => item.value === value)) ||
      null;
  }

  onAddressChange() {
    this.model.einvoicingBillingAddress = this.selectedAddress?.value || null;
  }
}
