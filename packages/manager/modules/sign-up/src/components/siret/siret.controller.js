import startCase from 'lodash/startCase';

import {
  LEGAL_FORM,
  PREFIX_TRANSLATION_LEGAL_FORM,
  TRACKING_PREFIX,
  LEGAL_FORM_ENTERPRISE,
  LEGAL_FORM_ASSOCIATION,
  VAT_CHECKBOX_LABEL_BY_LEGAL_FORM,
  fromSuggestion,
  isNdValue,
} from './siret.constants';

export default class SiretCtrl {
  /* @ngInject */
  constructor(
    atInternet,
    $translate,
    SiretService,
    coreConfig,
    $rootScope,
    $timeout,
  ) {
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.siretService = SiretService;
    this.$rootScope = $rootScope;
    this.$timeout = $timeout;
    this.search = '';
    this.isFirstSearch = true;
    this.displayManualForm = false;
    this.activeSelectSuggest = null;
    this.assistantUsed = false;
    this.assistantEmptyFields = {};
    this.user = coreConfig.getUser();
  }

  $onInit() {
    // disable if its from IN subsidiray and user is enterprise
    this.disableField =
      this.isIndianSubsidiary && this.user.legalform === LEGAL_FORM_ENTERPRISE;
    if (this.mode === 'modification') {
      this.isFirstSearch = false;
      this.displayManualForm = true;
      if (this.shouldApplyFrenchAssociationRules()) {
        this.assistantUsed = true;
        this.assistantEmptyFields = {
          organisation: true,
          siret: true,
          vat: true,
        };
      }

      this.lastVatValue = this.model.vat;
      this.hasInitialVat = Boolean(this.model.vat);
      this.noVat = !this.model.vat;

      this.$timeout(() => {
        this.setAddressAutocompleteActive(true);
      });
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
    this.lastVatValue = fromSuggestion(suggestSelected.vatID, '');
    this.noVat = !this.lastVatValue;
    this.model.vat = this.noVat ? null : this.lastVatValue;
    this.$rootScope.$broadcast('siret:companySelected', {
      address: fromSuggestion(suggestSelected.address, ''),
      city: fromSuggestion(suggestSelected.city, ''),
      zip: fromSuggestion(suggestSelected.zipCode, ''),
    });
    this.assistantUsed = true;
    this.assistantEmptyFields = {
      organisation: !this.model.organisation,
      siret: !this.model.companyNationalIdentificationNumber,
      vat: !this.lastVatValue,
    };
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
    this.assistantUsed = false;
    this.isNonDiffusible = false;
    this.search = '';
    if (!this.shouldApplyFrenchAssociationRules()) {
      this.model.companyNationalIdentificationNumber = null;
      this.model.organisation = null;
    }
    this.setAddressAutocompleteActive(true);
  }

  setAddressAutocompleteActive(active) {
    this.$rootScope.$broadcast('siret:autocompleteActive', {
      active: active && !this.shouldApplyFrenchAssociationRules(),
    });
  }

  $onChanges(changes) {
    if (changes.isFrenchAssociation && this.mode === 'modification') {
      if (this.shouldApplyFrenchAssociationRules()) {
        this.assistantUsed = true;
        this.assistantEmptyFields = {
          organisation: true,
          siret: true,
          vat: true,
        };
      }
      if (!changes.isFrenchAssociation.isFirstChange()) {
        this.setAddressAutocompleteActive(true);
      }
    }
  }

  getLegalForm() {
    return this.model.legalform || this.user.legalform;
  }

  shouldApplyFrenchAssociationRules() {
    if (this.isFrenchAssociation != null) {
      return this.isFrenchAssociation;
    }
    return this.isAssociation();
  }

  isAssociation() {
    return this.getLegalForm() === LEGAL_FORM_ASSOCIATION;
  }

  isSiretMandatory() {
    return !this.isAssociation();
  }

  isManualEntryAllowed(field) {
    return this.assistantUsed && Boolean(this.assistantEmptyFields[field]);
  }

  isOrganisationDisabled() {
    if (this.disableField) {
      return true;
    }
    if (this.mode === 'modification') {
      if (this.shouldApplyFrenchAssociationRules()) {
        return false;
      }
      return !this.isManualEntryAllowed('organisation');
    }
    return (
      this.assistantUsed &&
      Boolean(this.model.organisation) &&
      !this.isNonDiffusible
    );
  }

  isSiretDisabled() {
    if (this.disableField) {
      return true;
    }
    if (this.mode === 'modification') {
      return (
        this.shouldApplyFrenchAssociationRules() ||
        !this.isManualEntryAllowed('siret')
      );
    }
    return (
      this.assistantUsed &&
      Boolean(this.model.companyNationalIdentificationNumber)
    );
  }

  isVatDisabled() {
    if (this.disableField) {
      return true;
    }
    if (this.mode === 'modification') {
      if (this.shouldApplyFrenchAssociationRules()) {
        return false;
      }
      return !this.isManualEntryAllowed('vat');
    }
    return false;
  }

  getVatCheckboxLabelKey() {
    return VAT_CHECKBOX_LABEL_BY_LEGAL_FORM[this.getLegalForm()];
  }

  onNoVatChange(noVat) {
    if (noVat) {
      this.lastVatValue = this.model.vat || this.lastVatValue;
      this.model.vat = null;
    } else {
      this.model.vat = this.lastVatValue || null;
    }
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
