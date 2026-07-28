import clone from 'lodash/clone';
import find from 'lodash/find';
import flatten from 'lodash/flatten';
import pick from 'lodash/pick';
import values from 'lodash/values';
import { LANGUAGES } from '@ovh-ux/manager-config';

import {
  CONSENT_MARKETING_EMAIL_NAME,
  FIELD_NAME_LIST,
  READY_ONLY_PARAMS,
  READY_ONLY_RULES_PARAMS,
  SECTIONS,
  FIELD_WITHOUT_MARGIN_BOTTOM,
  TRACKING_PREFIX,
  FEATURES,
  IN_SUBSIDIARY,
  FR_COUNTRIES,
  USER_TYPE_ENTERPRISE,
  USER_TYPE_ASSOCIATION,
  USER_TYPE_ADMINISTRATION,
  USER_TYPE_INDIVIDUAL,
  USER_TYPE_OTHER,
  SUBSIDIARIES_VAT_FIELD_OVERRIDE,
} from './new-account-form-component.constants';
import { KYC_STATUS } from '../../../identity-documents/user-identity-documents.constant';
import { SUPPORT_URLS } from '../../user.constants';

// rendered by its dedicated component inside the siret block, never by the
// generic section loop
const EINVOICING_FIELD_NAME = 'einvoicingBillingAddress';

export default class NewAccountFormController {
  /* @ngInject */
  constructor(
    $q,
    $http,
    $timeout,
    $location,
    atInternet,
    coreConfig,
    Alerter,
    $translate,
    $anchorScroll,
    $scope,
    ovhFeatureFlipping,
    shellClient,
  ) {
    this.$q = $q;
    this.$http = $http;
    this.$timeout = $timeout;
    this.$location = $location;
    this.atInternet = atInternet;
    this.coreConfig = coreConfig;
    this.Alerter = Alerter;
    this.$translate = $translate;
    this.isLoading = false; // true when fetching data from api
    this.initError = null; // initialization error if any
    this.submitError = null;
    this.model = this.model || {}; // form model
    this.readonly = this.readonly || [];
    this.rules = null;
    this.isSubmitting = false;
    this.originalManagerLanguage = coreConfig.getUserLocale();
    this.user = coreConfig.getUser();
    this.$anchorScroll = $anchorScroll;
    this.$scope = $scope;
    this.ovhFeatureFlipping = ovhFeatureFlipping;
    this.SECTIONS = SECTIONS;
    this.shell = shellClient;
  }

  $onInit() {
    this.loading = true;

    // Indian subsidiary flag
    this.isIndianSubsidiary = this.user.ovhSubsidiary === IN_SUBSIDIARY;
    this.determineIsEditionDisabledByKyc(this.kycStatus);
    this.newSupportTicketUrl =
      SUPPORT_URLS.createTicket + this.user.ovhSubsidiary;

    // backup of original model
    this.originalModel = angular.copy(this.model);

    this.consentDecision = null;
    this.smsConsentDecision = null;

    return this.ovhFeatureFlipping
      .checkFeatureAvailability([
        FEATURES.emailConsent,
        FEATURES.smsConsent,
        FEATURES.otherCategory,
      ])
      .then((result) => {
        this.isEmailConsentAvailable = result.isFeatureAvailable(
          FEATURES.emailConsent,
        );
        this.isSmsConsentAvailable = result.isFeatureAvailable(
          FEATURES.smsConsent,
        );
        // Gates the FR e-invoicing "Autre" category controls (RG2/RG3/RG4)
        this.isOtherCategoryControlEnabled = result.isFeatureAvailable(
          FEATURES.otherCategory,
        );
      })
      .then(() => this.fetchRules(this.model))
      .then((rules) => {
        this.rules = rules;
      })
      .catch((err) => {
        this.initError = err.data?.message || err.message || err;
      })
      .finally(() => {
        this.loading = false;
        this.isSiretAvailable = this.siretFieldIsAvailable();
        this.$timeout(() => {
          if (this.fieldToFocus) {
            this.$anchorScroll(this.fieldToFocus);
          }
        });
      });
  }

  // initialize rules with /me data
  initializeRulesWithOriginalModel(rules) {
    Object.entries(this.originalModel).forEach(([key, value]) => {
      const rule = find(rules, { fieldName: key });
      if (rule) {
        rule.initialValue = value;
      }
    });

    return rules;
  }

  // return the list of rules from api
  fetchRules(_params) {
    let params = _params;

    const { customerCode } = params;

    // we don't want to send attributes outside of /rules
    if (this.rules) {
      params = pick(
        this.model,
        this.rules.map((rule) => rule.fieldName),
      );
    }

    // customer code does not belong to /rules, only displayed in the form
    params = Object.fromEntries(
      Object.entries(params).flatMap(([key, value]) => {
        if (!READY_ONLY_RULES_PARAMS.includes(key)) {
          return [[key, value]];
        }
        return [];
      }),
    );

    params.action = this.action;

    return this.$q
      .all({
        email: this.userAccountServiceInfos.fetchConsentDecision(
          CONSENT_MARKETING_EMAIL_NAME,
        ),
        sms: this.isSmsConsentAvailable
          ? this.userAccountServiceInfos.fetchMarketingConsentDecision()
          : this.$q.resolve(),
      })
      .then(({ email, sms }) => {
        this.consentDecision = !!email?.value;
        this.smsConsentDecision =
          this.isSmsConsentAvailable &&
          !!Object.keys(sms?.sms || {}).some((key) => sms.sms[key]);
      })
      .then(() => this.userAccountServiceInfos.postRules(params))
      .then((result) => {
        let emailFieldIndex;
        let phoneFieldIndex;

        // hide rules that are not editable
        const rules = result.map((rule, index) => {
          const editedRule = clone(rule);

          // rule is editable if not in the "this.readonly" list of fields.
          // The "email" field is a special case should. It should never be readonly.
          if (editedRule.fieldName === 'email') {
            emailFieldIndex = index;
            editedRule.readonly = false;
            editedRule.hasBottomMargin = this.coreConfig.isRegion('US');
          } else {
            editedRule.readonly = this.readonly.includes(editedRule.fieldName);
            if (
              editedRule.fieldName === FIELD_NAME_LIST.organisation &&
              this.isFrenchAssociation()
            ) {
              editedRule.readonly = false;
            }
            editedRule.hasBottomMargin = !FIELD_WITHOUT_MARGIN_BOTTOM.includes(
              editedRule.fieldName,
            );
            if (['phone'].includes(editedRule.fieldName)) {
              phoneFieldIndex = index;
            }
          }

          return editedRule;
        });

        if (!this.coreConfig.isRegion('US')) {
          rules.splice(emailFieldIndex + 1, 0, {
            in: null,
            mandatory: false,
            defaultValue: null,
            initialValue: this.consentDecision,
            fieldName: FIELD_NAME_LIST.commercialCommunicationsApproval,
            fieldType: 'checkbox',
            regularExpression: null,
            prefix: null,
            examples: null,
            hasBottomMargin: true,
          });
          rules.splice(phoneFieldIndex + 1, 0, {
            in: null,
            mandatory: false,
            defaultValue: null,
            initialValue: this.smsConsentDecision,
            fieldName: FIELD_NAME_LIST.smsConsent,
            fieldType: 'checkbox',
            regularExpression: null,
            prefix: null,
            examples: null,
            hasBottomMargin: true,
            disabled: () => this.model.phoneType !== 'mobile',
          });
        }
        return rules;
      })
      .then((rules) => this.initializeRulesWithOriginalModel(rules))
      .then((rules) => {
        // customer code does not belong to /rules, only displayed in the form
        rules.unshift({
          fieldName: FIELD_NAME_LIST.customerCode,
          mandatory: true,
          initialValue: customerCode || '-',
          hasBottomMargin: true,
        });

        rules.push({
          fieldName: FIELD_NAME_LIST.displayName,
          initialValue: this.model.displayName,
          hasBottomMargin: true,
        });

        const languageRuleIdx = rules.findIndex(
          (rule) => rule.fieldName === FIELD_NAME_LIST.language,
        );
        if (languageRuleIdx >= 0) {
          rules.splice(languageRuleIdx + 1, 0, {
            fieldName: 'managerLanguage',
            mandatory: true,
            initialValue: this.coreConfig.getUserLocale(),
            in: LANGUAGES.available.map((language) => language.key),
            hasBottomMargin: true,
          });
        }

        if (this.siretFieldIsAvailable()) {
          rules.push({
            fieldName: FIELD_NAME_LIST.corporationType,
            fieldType: 'select',
            mandatory: true,
            initialValue: this.model.corporationType,
          });
          this.formatSiretRules(rules);
        }

        const displayRules = rules
          .map((rule) => {
            let displayFieldName = rule.fieldName;
            if (rule.fieldName === FIELD_NAME_LIST.vat) {
              displayFieldName =
                SUBSIDIARIES_VAT_FIELD_OVERRIDE[
                  this.user.country.toUpperCase()
                ] || displayFieldName;
            }
            return {
              ...rule,
              displayFieldName,
            };
          })
          .sort((a, b) => {
            if (
              Object.keys(FIELD_NAME_LIST).indexOf(a.fieldName) >
              Object.keys(FIELD_NAME_LIST).indexOf(b.fieldName)
            ) {
              return 1;
            }
            return -1;
          });

        return displayRules.filter(
          (rule, index, all) =>
            all.findIndex((item) => item.fieldName === rule.fieldName) ===
            index,
        );
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  // on form submit callback
  submit() {
    this.atInternet.trackClick({
      name: 'dedicated::account::user::infos::save',
      type: 'action',
    });

    // RG3: saving is blocked while the category is still "Autre".
    if (this.isOtherCategorySelected()) {
      this.Alerter.alertFromSWS(
        this.$translate.instant('signup_legalform_other_save_blocked'),
        'ERROR',
        'InfoErrors',
      );
      return null;
    }

    this.isSubmitting = true;
    this.submitError = null;

    // we don't want to send attributes outside of /rules
    let model = pick(
      this.model,
      this.rules.map((rule) => rule.fieldName),
    );

    // we need to blank out some values for api to be happy
    Object.keys(this.originalModel).forEach((field) => {
      // attributes not in /rules and not readonly are blanked out
      if (
        !this.rules.find((rule) => rule.fieldName === field) &&
        this.readonly.indexOf(field) < 0
      ) {
        model[field] = null;
      }
    });

    // customer code does not belong to /rules, only displayed in the form
    // put on /me does not handle email modification
    model = Object.fromEntries(
      Object.entries(model).flatMap(([key, value]) => {
        if (!READY_ONLY_PARAMS.includes(key)) {
          return [[key, value]];
        }
        return [];
      }),
    );

    // stripped with the other READY_ONLY_PARAMS above (not a /newAccount/rules
    // param) but accepted by PUT /me — re-add the selected address (RG5)
    if (this.model.einvoicingBillingAddress) {
      model.einvoicingBillingAddress = this.model.einvoicingBillingAddress;
    }

    let promise = this.userAccountServiceInfos
      .updateUseraccountInfos(model)
      .then((result) => {
        const tracking = {
          name: `dedicated::account::user::infos_${
            result !== 'null' ? 'error' : 'success'
          }`,
          type: 'navigation',
        };
        if (this.isEmailConsentAvailable) {
          const emailConsent =
            typeof this.model.commercialCommunicationsApproval !== 'undefined'
              ? this.model.commercialCommunicationsApproval
              : this.consentDecision;
          tracking.accountEmailConsent = emailConsent ? 'opt-in' : 'opt-out';
        }
        if (this.isSmsConsentAvailable) {
          const smsConsent =
            typeof this.model.smsConsent !== 'undefined'
              ? this.model.smsConsent
              : this.smsConsentDecision;
          tracking.accountSmsConsent = smsConsent ? 'opt-in' : 'opt-out';
          tracking.accountPhoneType = this.model.phoneType;
        }
        this.atInternet.trackPage(tracking);
        if (result !== null) {
          return this.$q.reject(result);
        }
        this.coreConfig.updateUser(model);
        this.shell.environment.setUser(model);
        return result;
      })
      .catch((error) => {
        // If an error occurred we try to fetch an update for KYC request (if kyc feature is available)
        // in order to disable the fields if the edition is blocked by the KYC request
        this.getKycStatus().then((status) => {
          this.determineIsEditionDisabledByKyc(status);
        });
        return this.$q.reject(error);
      });

    if (this.originalModel.email !== this.model.email) {
      promise = promise
        .then(() => this.userAccountServiceInfos.changeEmail(this.model.email))
        .then(
          () =>
            this.$timeout(
              angular.noop,
              3000,
            ) /* add some delay for task creation */,
        );
    }

    const consentRequests = [];
    if (
      this.isEmailConsentAvailable &&
      this.originalModel.commercialCommunicationsApproval !==
        this.model.commercialCommunicationsApproval
    ) {
      consentRequests.push(
        this.userAccountServiceInfos.updateConsentDecision(
          CONSENT_MARKETING_EMAIL_NAME,
          this.model.commercialCommunicationsApproval || false,
        ),
      );
    }
    if (
      this.isSmsConsentAvailable &&
      this.originalModel.smsConsent !== this.model.smsConsent
    ) {
      consentRequests.push(
        this.userAccountServiceInfos.updateSmsMarketingConsentDecision(
          this.model.smsConsent || false,
        ),
      );
    }
    if (consentRequests.length > 0) {
      promise = promise
        .then(() => this.$q.all(consentRequests))
        .then(
          () =>
            this.$timeout(
              angular.noop,
              3000,
            ) /* add some delay for task creation */,
        );
    }

    return promise
      .then(() => {
        if (
          this.model.managerLanguage &&
          this.originalManagerLanguage !== this.model.managerLanguage
        ) {
          this.coreConfig.setUserLocale(this.model.managerLanguage);
          window.parent.location.reload();
        } else if (this.onSubmit) {
          this.onSubmit();
        }
      })
      .catch((err) => {
        this.submitError = err;
        // 400 with an address selected = stale PPF address (RG6): warn the
        // field and refresh the rules
        if (err?.status === 400 && this.model.einvoicingBillingAddress) {
          this.$scope.$broadcast('einvoicing.staleAddress');
          this.updateRules();
        }
        const isPrivateIndividual =
          this.model.legalform === USER_TYPE_INDIVIDUAL;
        const genericError = isPrivateIndividual
          ? this.$translate.instant('user_account_info_error')
          : this.$translate.instant(
              'signup_account_info_update_required_error',
              {
                companyType: this.$translate.instant(
                  `signup_enum_legalform_${this.model.legalform}`,
                ),
              },
            );
        const apiError = err.data?.message
          ? `<br />${this.$translate.instant('signup_account_info_api_error', {
              message: err.data.message,
            })}`
          : '';

        this.Alerter.alertFromSWS(
          `${genericError}${apiError}`,
          'ERROR',
          'InfoErrors',
        );
      })
      .finally(() => {
        this.isSubmitting = false;
      });
  }

  // return the list of form fieldsets
  getSections() {
    return Object.keys(this.SECTIONS);
  }

  getDisplayNameSection() {
    const isBusiness = [
      USER_TYPE_ENTERPRISE,
      USER_TYPE_ASSOCIATION,
      USER_TYPE_ADMINISTRATION,
    ].includes(this.model.legalform);
    return isBusiness ? 'activity' : 'personal';
  }

  // return the list of fields for a given fieldset name
  // readonly rules are not returned because they are not editable
  getRulesBySection(section) {
    // without this filter the e-invoicing rule lands in the "other" section
    const sectionRules = (this.rules || []).filter(
      (rule) => rule.fieldName !== EINVOICING_FIELD_NAME,
    );
    // special section to handle fields that does not belong to any section
    if (section === 'other') {
      return sectionRules.filter((rule) => {
        const allFields = flatten(values(this.SECTIONS));
        return (
          !allFields.includes(rule.fieldName) &&
          rule.fieldName !== FIELD_NAME_LIST.displayName &&
          !rule.readonly
        );
      });
    }
    const fields = [...this.SECTIONS[section]];
    if (section === this.getDisplayNameSection()) {
      fields.push(FIELD_NAME_LIST.displayName);
    }
    return sectionRules.filter(
      (rule) => fields.includes(rule.fieldName) && !rule.readonly,
    );
  }

  // absent when the PPF directory doesn't know the SIRET
  getEinvoicingRule() {
    return (this.rules || []).find(
      (rule) => rule.fieldName === EINVOICING_FIELD_NAME,
    );
  }

  getSiretRegularExpression() {
    return (this.rules || []).find(
      (rule) =>
        rule.fieldName === FIELD_NAME_LIST.companyNationalIdentificationNumber,
    )?.regularExpression;
  }

  updateRules() {
    return this.fetchRules(this.model)
      .then((newRules) => {
        if (!newRules) {
          return;
        }
        (this.rules || []).forEach((rule) => {
          if (!newRules.find((value) => value.fieldName === rule.fieldName)) {
            delete this.model[rule.fieldName];
          }
        });
        this.rules = newRules;

        if (this.siretFieldIsAvailable()) {
          this.formatSiretRules(newRules);
        }
      })
      .catch(angular.noop);
  }

  formatSiretRules(rules) {
    this.siretModuleRules = {};
    rules
      .filter((rule) => {
        return [
          'companyNationalIdentificationNumber',
          'vat',
          'organisation',
        ].includes(rule.fieldName);
      })
      .forEach((rule) => {
        this.siretModuleRules[rule.fieldName] = {
          mandatory: rule.mandatory,
          regularExpression: rule.regularExpression,
        };
      });
    return this.siretModuleRules;
  }

  // callback for when user changed a form field value
  onFieldChange(rule, value) {
    if (value !== this.model[rule.fieldName]) {
      // update model
      this.model[rule.fieldName] = value;

      if (rule.fieldName === FIELD_NAME_LIST.commercialCommunicationsApproval) {
        this.atInternet.trackClick({
          name: `${TRACKING_PREFIX}::product-email-consent::${
            value ? 'enable' : 'disable'
          }`,
          type: 'action',
          chapter1: 'account',
          chapter2: 'myaccount',
          chapter3: 'consent',
        });
      }

      if (rule.fieldName === FIELD_NAME_LIST.phoneType) {
        this.atInternet.trackClick({
          name: `${TRACKING_PREFIX}::phone-type::select-${value}`,
          type: 'action',
        });
        // if phone type is set to a value other than 'mobile' we reset the sms consent value
        if (value !== 'mobile') {
          this.$scope.$broadcast('account.smsConsent.reset');
        }
      }

      if (rule.fieldName === FIELD_NAME_LIST.smsConsent) {
        this.atInternet.trackClick({
          name: `${TRACKING_PREFIX}::sms-consent::${
            value ? 'enable' : 'disable'
          }`,
          type: 'action',
        });
      }

      if (
        rule.fieldName === FIELD_NAME_LIST.legalform ||
        rule.fieldName === FIELD_NAME_LIST.country
      ) {
        this.isSiretAvailable = this.siretFieldIsAvailable();
        this.syncAddressAutocompleteState();
      }

      return this.updateRules();
    }
    return null;
  }

  // compare original model to edited model
  hasChanges() {
    return !angular.equals(this.originalModel, this.model);
  }

  // The SIRET search assistant detected a legal form from the selected company;
  // apply it and re-run the same side effects as a manual legalform change so
  // the rules (mandatory fields, SIRET availability) match the new account type.
  onSiretLegalFormChange(legalform) {
    if (!legalform) {
      return null;
    }
    // the SIRET component shares our model instance (two-way binding), so it
    // has already written the new legal form: comparing against
    // this.model.legalform here would always match and skip the side effects
    this.model.legalform = legalform;
    this.isSiretAvailable = this.siretFieldIsAvailable();
    this.syncAddressAutocompleteState();
    // the legalform field keeps its displayed value in its own local copy, so
    // notify it to re-sync the select with the newly detected account type
    this.$scope.$broadcast('siret:legalFormChanged', { legalform });
    return this.updateRules();
  }

  isFrenchAssociation() {
    return (
      this.model?.legalform === USER_TYPE_ASSOCIATION &&
      FR_COUNTRIES.includes(this.model?.country)
    );
  }

  syncAddressAutocompleteState() {
    this.$scope.$broadcast('siret:autocompleteActive', {
      active: this.isSiretAvailable && !this.isFrenchAssociation(),
    });
  }

  siretFieldIsAvailable() {
    return (
      [
        USER_TYPE_ENTERPRISE,
        USER_TYPE_ASSOCIATION,
        USER_TYPE_ADMINISTRATION,
      ].includes(this.model?.legalform) &&
      FR_COUNTRIES.includes(this.model?.country)
    );
  }

  // The FR e-invoicing "Autre" category controls (RG2/RG3/RG4) are gated by a
  // feature flag and restricted to French customers.
  isOtherCategoryControlActive() {
    return (
      this.isOtherCategoryControlEnabled &&
      FR_COUNTRIES.includes(this.model?.country)
    );
  }

  // RG2/RG3: the currently selected category is the invalid "Autre" value.
  isOtherCategorySelected() {
    return (
      this.isOtherCategoryControlActive() &&
      this.model?.legalform === USER_TYPE_OTHER
    );
  }

  // RG4: the saved category was "Autre" and the customer switched to a category
  // holding company data (B2B/B2G/association). B2C (individual) is excluded (RG5).
  shouldShowCategorySwitchWarning() {
    return (
      this.isOtherCategoryControlActive() &&
      this.originalModel?.legalform === USER_TYPE_OTHER &&
      [
        USER_TYPE_ENTERPRISE,
        USER_TYPE_ASSOCIATION,
        USER_TYPE_ADMINISTRATION,
      ].includes(this.model?.legalform)
    );
  }

  // RG4: bring the customer to the company data (SIRET) section of the form.
  scrollToCompanyData() {
    this.$anchorScroll('ovh_form_content_activity');
  }

  isFieldHiddenForFr(rule) {
    return (
      FR_COUNTRIES.includes(this.model?.country) &&
      [
        FIELD_NAME_LIST.corporationType,
        FIELD_NAME_LIST.nationalIdentificationNumber,
      ].includes(rule?.fieldName)
    );
  }

  determineIsEditionDisabledByKyc(kycRequest) {
    this.isEditionDisabledByKyc =
      this.user?.kycValidated ||
      [KYC_STATUS.OPEN, KYC_STATUS.OK].includes(kycRequest?.status);
  }

  onDismiss() {
    this.isUpdated = false;
  }
}
