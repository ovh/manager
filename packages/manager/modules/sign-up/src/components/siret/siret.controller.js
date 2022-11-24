import {
  LEGAL_FORM,
  PREFIX_TRANSLATION_LEGAL_FORM,
  TRACKING_PREFIX,
} from './siret.constants';

export default class SiretCtrl {
  /* @ngInject */
  constructor(atInternet, $translate, SiretService) {
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.siretService = SiretService;
    this.search = '';
    this.isFirstSearch = true;
    this.displayManualForm = false;
  }

  $onInit() {
    this.model.companyNationalIdentificationNumber = null;

    this.legalFormList = LEGAL_FORM.map((value) =>
      this.$translate.instant(PREFIX_TRANSLATION_LEGAL_FORM + value),
    );

    this.trackingPrefix = TRACKING_PREFIX[this.trackingMode];
  }

  submitSearch() {
    this.trackClick('search');
    this.isFirstSearch = false;
    if (!this.searching) {
      this.searching = true;
      return this.siretService
        .getSiret({
          country: this.country.toUpperCase(),
          identifier: this.search,
        })
        .then((suggest) => {
          this.trackPage(suggest.entryList?.length > 0 ? 'list' : 'no-result');
          this.suggest = suggest;
        })
        .finally(() => {
          this.searching = false;
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
      return this.submitSearch();
    }
    this.model.companyNationalIdentificationNumber =
      suggestSelected.secondaryCNIN;
    this.model.organisation = suggestSelected.name;
    this.suggest = { ...this.suggest, entryList: [suggestSelected] };
    return null;
  }

  onManualFormClick() {
    this.trackClick('add-company-manually');
    this.displayManualForm = true;
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
