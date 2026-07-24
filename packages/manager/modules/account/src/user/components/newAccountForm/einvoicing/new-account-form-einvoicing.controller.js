import {
  FR_COUNTRIES,
  USER_TYPE_ENTERPRISE,
  USER_TYPE_ASSOCIATION,
  USER_TYPE_ADMINISTRATION,
} from '../new-account-form-component.constants';

const B2B_LEGAL_FORMS = [
  USER_TYPE_ENTERPRISE,
  USER_TYPE_ASSOCIATION,
  USER_TYPE_ADMINISTRATION,
];

const SIRET_REGEX = /^\d{14}$/;

/**
 * E-invoicing billing address picker driven by the PPF rule (RG1-RG7).
 * Isolated from the main profile form: it fetches its own rule when the SIRET is
 * ready and saves the selected address on selection (RG5) via PUT /me.
 */
export default class NewAccountFormEinvoicingController {
  /* @ngInject */
  constructor() {
    this.rule = null;
    this.loading = false;
    this.saving = false;
    this.saveError = false;
  }

  $onChanges(changes) {
    if (changes.siret || changes.legalForm || changes.country) {
      this.refreshRules();
    }
  }

  // FR B2B/B2G with a full 14-digit SIRET.
  isEligible() {
    return (
      FR_COUNTRIES.includes(this.country) &&
      B2B_LEGAL_FORMS.includes(this.legalForm) &&
      !!this.siret &&
      SIRET_REGEX.test(this.siret)
    );
  }

  hasAddresses() {
    return !!this.rule && !!this.rule.in && this.rule.in.length > 0;
  }

  refreshRules() {
    this.saveError = false;
    if (!this.isEligible()) {
      this.rule = null;
      return null;
    }
    this.loading = true;
    return this.userAccountServiceInfos
      .getEinvoicingRules({ siret: this.siret, legalForm: this.legalForm })
      .then((rule) => {
        this.rule = rule;
        this.preselect();
      })
      .catch(() => {
        // RG1: no rule / directory unavailable → field stays hidden.
        this.rule = null;
      })
      .finally(() => {
        this.loading = false;
      });
  }

  // RG3: pre-select the default (or single) address when nothing is chosen yet.
  preselect() {
    if (
      !this.rule ||
      !this.rule.visible ||
      this.model.einvoicingBillingAddress
    ) {
      return;
    }
    const single =
      this.rule.in && this.rule.in.length === 1 ? this.rule.in[0] : null;
    const preselected = this.rule.defaultValue || single;
    if (preselected) {
      this.model.einvoicingBillingAddress = preselected;
    }
  }

  // RG5: save the selected address; RG6: re-fetch and prompt again on a 400.
  onSelect() {
    const address = this.model.einvoicingBillingAddress;
    if (!address) {
      return null;
    }
    this.saving = true;
    this.saveError = false;
    return this.userAccountServiceInfos
      .saveEinvoicingBillingAddress(address)
      .then(() => {
        this.saved = true;
      })
      .catch((error) => {
        // RG6: the address is no longer active in the PPF directory.
        if (error && error.status === 400) {
          this.saved = false;
          this.saveError = true;
          this.model.einvoicingBillingAddress = null;
          return this.refreshRules().then(() => {
            this.saveError = true;
          });
        }
        return null;
      })
      .finally(() => {
        this.saving = false;
      });
  }
}
