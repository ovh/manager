import startCase from 'lodash/startCase';

import {
  LEGAL_FORM,
  PREFIX_TRANSLATION_LEGAL_FORM,
  TRACKING_PREFIX,
  LEGAL_FORM_ENTERPRISE,
  fromSuggestion,
  isNdValue,
} from './siret.constants';

export default class SiretCtrl {
  /* @ngInject */
  constructor(atInternet, $translate, SiretService, coreConfig) {
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.siretService = SiretService;
    this.search = '';
    this.isFirstSearch = true;
    this.displayManualForm = false;
    this.activeSelectSuggest = null;
    this.user = coreConfig.getUser();
  }

  $onInit() {
    // disable if its from IN subsidiray and user is enterprise
    this.disableField =
      this.isIndianSubsidiary && this.user.legalform === LEGAL_FORM_ENTERPRISE;
    if (this.mode === 'modification') {
      this.isFirstSearch = false;
      this.displayManualForm = true;
      this.isSuggestPopulated = !!(
        this.model.organisation ||
        this.model.companyNationalIdentificationNumber
      );
    }

    this.legalFormList = LEGAL_FORM.map((value) =>
      this.$translate.instant(PREFIX_TRANSLATION_LEGAL_FORM + value),
    );

    this.trackingPrefix = TRACKING_PREFIX[this.trackingMode];
  }

  submitSearch(needTracking = true) {
    if (needTracking) {
      this.trackClick('search');
    }
    this.isFirstSearch = false;
    if (!this.searching) {
      this.searching = true;
      return this.siretService
        .getSiret({
          country: this.country.toUpperCase(),
          identifier: this.search,
        })
        .then((suggest) => {
          this.searching = false;
          if (needTracking) {
            if (suggest.error) {
              this.trackPage('error');
            } else {
              this.trackPage(
                suggest.entryList?.length > 0 ? 'list' : 'no-result',
              );
            }
          }
          this.suggest = suggest;
          // To select the suggest if there is only one suggest.
          if (suggest.entryList?.length === 1) {
            [this.activeSelectSuggest] = suggest.entryList;
            this.selectSuggest(this.activeSelectSuggest);
          }
        });
    }
    return null;
  }

  selectSuggest(suggestSelected) {
    if (this.suggest.type === 'name' || this.suggest.type === 'siren') {
      this.search =
        this.suggest.type === 'name'
          ? suggestSelected.primaryCNIN
          : suggestSelected.secondaryCNIN;
      return this.submitSearch(false);
    }
    this.model.companyNationalIdentificationNumber =
      suggestSelected.secondaryCNIN;
    const isNonDiffusible =
      isNdValue(suggestSelected.name) || isNdValue(suggestSelected.address);
    this.model.organisation = fromSuggestion(
      suggestSelected.name,
      this.model.organisation,
    );
    this.model.vat = fromSuggestion(suggestSelected.vat, this.model.vat);
    this.model.address = fromSuggestion(suggestSelected.address, '');
    this.model.city = fromSuggestion(suggestSelected.city, '');
    this.model.zip = fromSuggestion(suggestSelected.zip, '');
    this.isSuggestPopulated = true;
    this.isNonDiffusible = isNonDiffusible;
    this.suggest = { ...this.suggest, entryList: [suggestSelected] };
    if (this.mode === 'modification') {
      this.isFirstSearch = false;
      this.displayManualForm = true;
    }
    return null;
  }

  onManualFormClick() {
    this.trackClick('add-company-manually');
    this.displayManualForm = true;
  }

  goToSearchMode() {
    this.trackClick('search-assistant');
    this.isFirstSearch = true;
    this.displayManualForm = false;
    this.isValid = false;
    this.isSuggestPopulated = false;
    this.isNonDiffusible = false;
    this.search = '';
    this.model.companyNationalIdentificationNumber = null;
    this.model.organisation = null;
  }

  onFieldBlur(field) {
    if (field?.$invalid) {
      this.onFieldError(startCase(field.$name));
    }
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
