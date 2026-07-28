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
const SIREN_LENGTH = 9;

/**
 * E-invoicing billing address field driven by the PPF rule
 * (einvoicing_billing_address entry of the rules response, no new API call):
 * - `visible: false`      → nothing rendered.
 * - empty `value.in`      → informational banner (B2B uses the SIREN, B2G a
 *   generic message). No selection.
 * - single `value.in`     → informational banner (from `default_value`); the
 *   address is used automatically.
 * - multiple `value.in`   → a mandatory <select> the customer must pick from
 *   (B2G gets an extra directory note).
 *
 * The selected/auto-selected value lives in `model.einvoicingBillingAddress`
 * and is saved by the main form submit (PUT /me). On a 400 the parent broadcasts
 * `einvoicing.staleAddress` so we refresh the rules and prompt again (RG6).
 */
export default class NewAccountFormEinvoicingController {
  /* @ngInject */
  constructor($scope) {
    this.$scope = $scope;
    this.rule = null;
    this.loading = false;
    this.staleAddress = false;
  }

  $onInit() {
    this.$scope.$on('einvoicing.staleAddress', () => {
      this.staleAddress = true;
      this.model.einvoicingBillingAddress = null;
      this.refreshRules();
    });
  }

  $onChanges(changes) {
    if (changes.siret || changes.legalForm || changes.country) {
      this.staleAddress = false;
      this.refreshRules();
    }
  }

  // FR B2B/B2G with a full 14-digit SIRET.
  isEligible() {
    return (
      FR_COUNTRIES.includes(this.country) &&
      ELIGIBLE_LEGAL_FORMS.includes(this.legalForm) &&
      !!this.siret &&
      SIRET_REGEX.test(this.siret)
    );
  }

  isB2g() {
    return B2G_LEGAL_FORMS.includes(this.legalForm);
  }

  getSiren() {
    return (this.siret || '').slice(0, SIREN_LENGTH);
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

  // Address used for the single-address case (defaultValue, else the only entry).
  getSingleAddress() {
    if (!this.rule) {
      return null;
    }
    const addresses = this.getAddresses();
    return (
      this.rule.defaultValue || (addresses.length === 1 ? addresses[0] : null)
    );
  }

  refreshRules() {
    if (!this.isEligible()) {
      this.rule = null;
      return null;
    }
    this.loading = true;
    return this.userAccountServiceInfos
      .getEinvoicingRules({ siret: this.siret, legalForm: this.legalForm })
      .then((rule) => {
        this.rule = rule;
        this.syncModelValue();
      })
      .catch(() => {
        // No rule / directory unavailable → keep the field hidden.
        this.rule = null;
      })
      .finally(() => {
        this.loading = false;
      });
  }

  // Keep model.einvoicingBillingAddress consistent with the current rule.
  syncModelValue() {
    if (!this.rule || !this.rule.visible || this.isEmpty()) {
      // Nothing to submit for the hidden / empty cases.
      this.model.einvoicingBillingAddress = null;
      return;
    }
    if (this.hasSingleAddress()) {
      // Used automatically.
      this.model.einvoicingBillingAddress = this.getSingleAddress();
      return;
    }
    // Multiple: drop a stale pre-selected value that is no longer available.
    if (
      this.model.einvoicingBillingAddress &&
      !this.getAddresses().includes(this.model.einvoicingBillingAddress)
    ) {
      this.model.einvoicingBillingAddress = null;
    }
  }
}
