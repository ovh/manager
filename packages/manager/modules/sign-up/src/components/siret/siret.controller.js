import startCase from 'lodash/startCase';

import {
  LEGAL_FORM,
  PREFIX_TRANSLATION_LEGAL_FORM,
  TRACKING_PREFIX,
  LEGAL_FORM_ENTERPRISE,
  LEGAL_FORM_ASSOCIATION,
  VAT_CHECKBOX_LABEL_BY_LEGAL_FORM,
  SIRET_RULE_FIELD,
  SIRET_SEARCH_REGEXP,
  SIRET_FOCUS_PARAM,
  OPEN_SEARCH_MODAL_EVENT,
  fromSuggestion,
  isNdValue,
  getLegalFormFromCode,
  getCompanyNameLabelKey as companyNameLabelKey,
  getUpdateSearchAssistantLabelKey as updateSearchAssistantLabelKey,
  calculateFRVATNumber,
} from './siret.constants';

export default class SiretCtrl {
  /* @ngInject */
  constructor(
    atInternet,
    $translate,
    SiretService,
    coreConfig,
    $rootScope,
    $scope,
    $timeout,
  ) {
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.siretService = SiretService;
    this.$rootScope = $rootScope;
    this.$scope = $scope;
    this.$timeout = $timeout;
    this.search = '';
    this.isFirstSearch = true;
    this.displayManualForm = false;
    this.searchModalOpen = false;
    this.activeSelectSuggest = null;
    this.assistantUsed = false;
    this.assistantEmptyFields = {};
    this.assistantInvalidFields = {};
    this.user = coreConfig.getUser();
  }

  $onInit() {
    this.model = this.model || {};
    // disable if its from IN subsidiray and user is enterprise
    this.disableField =
      this.isIndianSubsidiary && this.user?.legalform === LEGAL_FORM_ENTERPRISE;

    // In modification mode the assistant searches by SIRET only (14 digits)
    this.searchPattern =
      this.mode === 'modification' ? SIRET_SEARCH_REGEXP : undefined;

    if (this.mode === 'modification') {
      // The edition form is never swapped out: the SIRET lookup happens in a
      // modal, so the customer keeps their current data in sight until they
      // validate the company found.
      this.isFirstSearch = false;
      this.displayManualForm = true;
      // Deep-links (container CompanyInformationModal / hub SiretBanner) carry
      // fieldToFocus=siretForm to land the customer straight on the lookup.
      this.searchModalOpen = this.fieldToFocus === SIRET_FOCUS_PARAM;
      // an error message rendered by the surrounding form can reopen the modal
      this.$scope.$on(OPEN_SEARCH_MODAL_EVENT, () => this.openSearchModal());

      if (this.shouldApplyFrenchAssociationRules()) {
        this.assistantUsed = true;
        this.assistantEmptyFields = {
          organisation: true,
          siret: true,
          vat: true,
        };
        this.assistantInvalidFields = {};
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

  // Strip spaces from the SIRET entered in the assistant (MANAGER-21817).
  // Scoped to modification mode where the search is SIRET-only; creation keeps
  // free-text search (company name / SIREN) where spaces are meaningful.
  onSearchChange() {
    if (this.mode === 'modification' && this.search) {
      this.search = this.search.replace(/\s/g, '');
    }
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
          country: (this.country || '').toUpperCase(),
          identifier:
            this.mode === 'modification'
              ? (this.search || '').replace(/\s/g, '')
              : this.search,
        })
        .then((suggest = {}) => {
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
        })
        .catch(() => {
          this.searching = false;
          this.suggest = { error: true, entryList: [] };
        });
    }
    return null;
  }

  selectSuggest(suggestSelected) {
    if (!suggestSelected) {
      return null;
    }
    this.model = this.model || {};
    this.suggest = this.suggest || {};
    if (this.suggest.type === 'name' || this.suggest.type === 'siren') {
      this.search =
        this.suggest.type === 'name'
          ? suggestSelected.primaryCNIN
          : suggestSelected.secondaryCNIN;
      return this.submitSearch(false);
    }
    this.suggest = { ...this.suggest, entryList: [suggestSelected] };
    this.applySuggestion(suggestSelected);
    return null;
  }

  /**
   * Writes a company picked through the search assistant into the shared model.
   * Called from the inline suggestion list (creation) and from the lookup modal
   * once the customer validated the company found (modification) — never
   * before, so a dismissed modal changes nothing.
   */
  applySuggestion(suggestSelected) {
    this.model = this.model || {};
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
    // Drive the account type from the company legal-form code and back-fill the
    // FR VAT number for corporations, so an erroneous account type can no longer
    // deadlock the user (mirrors the account-creation flow).
    this.applyLegalFormFromSuggestion(suggestSelected);
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
    // When the assistant returns a value that breaks the rules, keep the field
    // editable so the user can fix erroneous data instead of being deadlocked
    // (the API would keep rejecting the unchangeable value otherwise).
    this.assistantInvalidFields = {
      organisation: this.isAssistantValueInvalid(
        'organisation',
        this.model.organisation,
      ),
      siret: this.isAssistantValueInvalid(
        'siret',
        this.model.companyNationalIdentificationNumber,
      ),
      vat: this.isAssistantValueInvalid('vat', this.model.vat),
    };
    this.isNonDiffusible = isNonDiffusible;
    // The confirmation checkbox is bound to controller state, which outlives the
    // teardown of its own scope: untick it explicitly so freshly fetched company
    // data always has to be confirmed again.
    this.informationConfirmed = false;
  }

  // Detects the account type from the selected company legalFormCode and, for
  // corporations without a VAT, computes the FR VAT number from the SIREN.
  // Scoped to modification: creation owns its own account-type selection.
  applyLegalFormFromSuggestion(suggestSelected) {
    if (this.mode !== 'modification') {
      return;
    }
    const detectedLegalForm = getLegalFormFromCode(
      suggestSelected.legalFormCode,
    );
    if (detectedLegalForm && detectedLegalForm !== this.model.legalform) {
      // Shared two-way model keeps the account-type field in sync; the callback
      // lets the parent form re-fetch its rules for the new legal form.
      this.model.legalform = detectedLegalForm;
      if (this.onLegalFormChange) {
        this.onLegalFormChange({ legalform: detectedLegalForm });
      }
    }
    const effectiveLegalForm = detectedLegalForm || this.getLegalForm();
    if (effectiveLegalForm === LEGAL_FORM_ENTERPRISE && !this.lastVatValue) {
      const computedVat = calculateFRVATNumber(suggestSelected.primaryCNIN);
      if (computedVat) {
        this.lastVatValue = computedVat;
        this.noVat = false;
        this.model.vat = computedVat;
      }
    }
  }

  onManualFormClick() {
    this.trackClick('add-company-manually');
    this.displayManualForm = true;
  }

  onSearchAssistantClick() {
    return this.mode === 'modification'
      ? this.openSearchModal()
      : this.goToSearchMode();
  }

  /**
   * Opens the SIRET lookup modal. Deliberately touches nothing but the modal
   * visibility: the edition form and the shared model must stay intact until
   * the customer validates a company (or dismisses the modal).
   */
  openSearchModal() {
    this.trackClick('search-assistant');
    this.searchModalOpen = true;
  }

  closeSearchModal() {
    this.searchModalOpen = false;
  }

  onSearchModalValidate(suggestion) {
    this.searchModalOpen = false;
    if (suggestion) {
      this.applySuggestion(suggestion);
    }
  }

  goToSearchMode() {
    this.trackClick('search-assistant');
    this.isFirstSearch = true;
    this.displayManualForm = false;
    this.isValid = false;
    this.informationConfirmed = false;
    this.assistantUsed = false;
    this.assistantInvalidFields = {};
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
        this.assistantInvalidFields = {};
      }
      if (!changes.isFrenchAssociation.isFirstChange()) {
        this.setAddressAutocompleteActive(true);
      }
    }
  }

  getLegalForm() {
    return this.model?.legalform || this.user?.legalform;
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
    return (
      this.assistantUsed &&
      (Boolean(this.assistantEmptyFields[field]) ||
        Boolean(this.assistantInvalidFields[field]))
    );
  }

  // Validates a value picked by the search assistant against the field rules
  // (mandatory + regularExpression), replicating AngularJS ngPattern behaviour
  // where a string pattern is anchored with ^...$.
  isAssistantValueInvalid(field, value) {
    const rule = this.rules?.[SIRET_RULE_FIELD[field]];
    if (!rule) {
      return false;
    }
    const stringValue = value == null ? '' : String(value);
    if (stringValue.trim() === '') {
      return Boolean(rule.mandatory);
    }
    if (rule.regularExpression) {
      const regExp =
        rule.regularExpression instanceof RegExp
          ? rule.regularExpression
          : new RegExp(`^${rule.regularExpression}$`);
      return !regExp.test(stringValue);
    }
    return false;
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

  // "Nom de l'entreprise / l'association / l'administration" depending on the legal form
  getCompanyNameLabelKey() {
    return companyNameLabelKey(this.getLegalForm());
  }

  getUpdateSearchAssistantLabelKey() {
    return updateSearchAssistantLabelKey(this.getLegalForm());
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
