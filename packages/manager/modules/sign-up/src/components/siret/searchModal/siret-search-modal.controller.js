import {
  TRACKING_PREFIX,
  SIRET_SEARCH_REGEXP,
  fromSuggestion,
  getUpdateSearchAssistantLabelKey as updateSearchAssistantLabelKey,
  isNdValue,
} from '../siret.constants';

/**
 * SIRET lookup modal: searches a company by SIRET, shows the company found for
 * review and hands it back to the caller through `onValidate` only once the
 * customer has confirmed it. Nothing outside this component is mutated, so a
 * dismissed modal leaves the surrounding form exactly as it was.
 */
export default class SiretSearchModalCtrl {
  /* @ngInject */
  constructor(atInternet, SiretService) {
    this.atInternet = atInternet;
    this.siretService = SiretService;
    this.search = '';
    this.searching = false;
    this.suggest = null;
    this.selected = null;
  }

  $onInit() {
    this.trackingPrefix = TRACKING_PREFIX[this.trackingMode || 'modification'];
  }

  // The lookup is by SIRET only (14 digits), so spaces are never meaningful
  // (MANAGER-21817).
  onSearchChange() {
    if (this.search) {
      this.search = this.search.replace(/\s/g, '');
    }
    // Editing the SIRET invalidates the company found: drop it so the customer
    // cannot validate a company that no longer matches what they typed.
    if (this.suggest && this.search !== this.searchedValue) {
      this.suggest = null;
      this.selected = null;
    }
  }

  // The modal is rendered inside the surrounding form: intercepting Enter here
  // keeps it from bubbling up as an implicit submit of that form.
  onSearchKeyDown(event) {
    if ((event.key || '').toLowerCase() !== 'enter') {
      return;
    }
    event.preventDefault();
    if (this.canSearch()) {
      this.submitSearch();
    }
  }

  // Validated in the controller rather than with ngModel validators: an invalid
  // control here would propagate to the surrounding form and lock its submit.
  canSearch() {
    return !this.searching && SIRET_SEARCH_REGEXP.test(this.search || '');
  }

  submitSearch() {
    if (this.searching) {
      return null;
    }
    this.trackClick('search');
    this.searching = true;
    this.suggest = null;
    this.selected = null;
    this.searchedValue = (this.search || '').replace(/\s/g, '');
    return this.siretService
      .getSiret({
        country: (this.country || '').toUpperCase(),
        identifier: this.searchedValue,
      })
      .then((suggest = {}) => {
        this.searching = false;
        if (suggest.error) {
          this.trackPage('error');
        } else {
          this.trackPage(suggest.entryList?.length > 0 ? 'list' : 'no-result');
        }
        this.suggest = suggest;
        // a SIRET matches a single establishment: preselect it for review
        if (suggest.entryList?.length === 1) {
          [this.selected] = suggest.entryList;
        }
      })
      .catch(() => {
        this.searching = false;
        this.suggest = { error: true, entryList: [] };
      });
  }

  selectSuggest(suggestSelected) {
    this.selected = suggestSelected || null;
  }

  validate() {
    if (!this.selected) {
      return;
    }
    this.trackClick('validate');
    this.onValidate({ suggestion: this.selected });
  }

  cancel() {
    this.trackClick('cancel');
    this.onCancel();
  }

  hasSearched() {
    return !this.searching && Boolean(this.suggest);
  }

  hasError() {
    return Boolean(this.suggest?.error);
  }

  hasEntries() {
    return this.suggest?.entryList?.length > 0;
  }

  hasNoResult() {
    return Boolean(this.suggest) && !this.hasError() && !this.hasEntries();
  }

  // Several establishments can only show up on a non-SIRET search; keep the
  // picker so the customer stays in control if the API ever returns more.
  hasManyEntries() {
    return this.suggest?.entryList?.length > 1;
  }

  // Once a company has been found the search button becomes the retry loop.
  getSearchButtonLabelKey() {
    return this.suggest ? 'siret_modal_search_again' : 'siret_search_button';
  }

  // "Update my company / association / administration information"
  getHeadingKey() {
    return updateSearchAssistantLabelKey(this.legalForm);
  }

  getCompanyName() {
    return fromSuggestion(this.selected?.name, '');
  }

  getCompanyAddress() {
    return [
      fromSuggestion(this.selected?.address, ''),
      fromSuggestion(this.selected?.zipCode, ''),
      fromSuggestion(this.selected?.city, ''),
    ]
      .filter(Boolean)
      .join(' ');
  }

  // Non-disclosable companies come back as [ND]: warn that the details will
  // have to be filled in by hand instead of showing an empty review block.
  isNonDiffusible() {
    return isNdValue(this.selected?.name) || isNdValue(this.selected?.address);
  }

  trackClick(hit) {
    this.atInternet.trackClick({
      name: `${this.trackingPrefix}${hit}`,
      type: 'action',
    });
  }

  trackPage(hit) {
    this.atInternet.trackPage({
      name: `${this.trackingPrefix}${hit}`,
      type: 'navigation',
    });
  }
}
