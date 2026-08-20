import {
  TRACKING_PREFIX,
  SIRET_SEARCH_REGEXP,
  fromSuggestion,
  getCompanyNameLabelKey as companyNameLabelKey,
  getModalReviewIntroKey as modalReviewIntroKey,
  getUpdateSearchAssistantLabelKey as updateSearchAssistantLabelKey,
  hasMissingValues,
  isMissingValue,
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
    // Seed the field with whatever SIRET the account already holds, so the
    // customer never retypes what we know — a SIREN or a value the directory
    // would reject still gives them a head start over an empty field.
    const initial = (this.initialSearch || '').replace(/\s/g, '');
    this.search = initial;
    // Only a usable 14-digit SIRET is looked up on open: searching a value we
    // know to be incomplete would greet the customer with an error they did not
    // ask for. needTracking=false — nothing was clicked, but the outcome is
    // still tracked.
    if (SIRET_SEARCH_REGEXP.test(initial)) {
      this.submitSearch(false);
    }
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

  onSearchBlur() {
    this.searchTouched = true;
  }

  // Drives the oui-field error state. Only once the customer left a non-empty
  // field: an empty field is already covered by the disabled search button, and
  // flagging every half-typed SIRET would flash an error on each keystroke.
  isSearchInvalid() {
    return (
      Boolean(this.searchTouched) &&
      Boolean(this.search) &&
      !SIRET_SEARCH_REGEXP.test(this.search)
    );
  }

  // Before a company is on screen the intro tells the customer to enter their
  // SIRET; once one is displayed it asks them to check it instead.
  getIntroKey() {
    return this.selected
      ? modalReviewIntroKey(this.legalForm)
      : 'siret_update_search_assistant_info';
  }

  $onDestroy() {
    this.destroyed = true;
  }

  /**
   * A lookup response is worthless in two cases, both reachable because the
   * auto-search starts as soon as the modal opens — exactly when a customer who
   * came to CHANGE their SIRET starts typing, or gives up and closes it:
   *  - the SIRET in the field is no longer the one we searched: showing the old
   *    company next to the new number would let Validate apply the wrong one;
   *  - the modal is gone: nothing to render, and no hit worth reporting.
   */
  shouldDiscardResponse() {
    return (
      this.destroyed ||
      this.searchedValue !== (this.search || '').replace(/\s/g, '')
    );
  }

  submitSearch(needTracking = true) {
    if (this.searching) {
      return null;
    }
    if (needTracking) {
      this.trackClick('search');
    }
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
        if (this.shouldDiscardResponse()) {
          return;
        }
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
        if (this.shouldDiscardResponse()) {
          return;
        }
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

  // Validating an incomplete company lands the customer on fields they must fill
  // in themselves, so the button says so instead of promising a plain "Validate".
  getValidateLabelKey() {
    return this.isNonDiffusible()
      ? 'siret_modal_complete'
      : 'siret_modal_validate';
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

  // A company that does not disclose its data comes back with [ND] tokens or
  // empty values: warn that those details will have to be filled in by hand
  // rather than leaving the review block silently showing dashes.
  isNonDiffusible() {
    return hasMissingValues(this.selected);
  }

  /**
   * The values the customer will have to type in themselves, because the
   * directory withheld them or simply has none. Labelled with the same wording
   * as the form fields they will land in, so the list and the form read as one.
   * Memoized on the selection: ng-repeat must not get a fresh array per digest.
   */
  getMissingFieldLabelKeys() {
    if (this.missingFieldsSource !== this.selected) {
      this.missingFieldsSource = this.selected;
      this.missingFieldLabelKeys = [
        { value: this.selected?.name, key: companyNameLabelKey(this.legalForm) },
        {
          value: this.selected?.address,
          key: 'siret_modal_non_diffusible_field_address',
        },
        {
          value: this.selected?.zipCode,
          key: 'siret_modal_non_diffusible_field_zip',
        },
        {
          value: this.selected?.city,
          key: 'siret_modal_non_diffusible_field_city',
        },
      ]
        .filter(({ value }) => isMissingValue(value))
        .map(({ key }) => key);
    }
    return this.missingFieldLabelKeys;
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
