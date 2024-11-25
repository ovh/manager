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
  USER_TYPE_ENTERPRISE,
  SUBSIDIARIES_VAT_FIELD_OVERRIDE,
} from './new-account-form-component.constants';
import { KYC_STATUS } from '../../../identity-documents/user-identity-documents.constant';
import { SUPPORT_URLS } from '../../user.constants';

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
      .checkFeatureAvailability([FEATURES.emailConsent, FEATURES.smsConsent])
      .then((result) => {
        this.isEmailConsentAvailable = result.isFeatureAvailable(
          FEATURES.emailConsent,
        );
        this.isSmsConsentAvailable = result.isFeatureAvailable(
          FEATURES.smsConsent,
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
        this.consentDecision = !!email.value;
        this.smsConsentDecision =
          this.isSmsConsentAvailable &&
          !!Object.keys(sms.sms).some((key) => sms.sms[key]);
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

        return displayRules;
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
          this.$location.search('isUpdated', true);
          this.onSubmit();
        }
      })
      .catch((err) => {
        this.submitError = err;
        this.Alerter.alertFromSWS(
          this.$translate.instant('user_account_info_error'),
          {
            type: 'ERROR',
            message: err.data?.message,
          },
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

  // return the list of fields for a given fieldset name
  // readonly rules are not returned because they are not editable
  getRulesBySection(section) {
    // special section to handle fields that does not belong to any section
    if (section === 'other') {
      return this.rules.filter((rule) => {
        const allFields = flatten(values(this.SECTIONS));
        return !allFields.includes(rule.fieldName) && !rule.readonly;
      });
    }
    const fields = this.SECTIONS[section];
    return this.rules.filter(
      (rule) => fields.includes(rule.fieldName) && !rule.readonly,
    );
  }

  updateRules() {
    this.fetchRules(this.model).then((newRules) => {
      this.rules.forEach((rule) => {
        if (!newRules.find((value) => value.fieldName === rule.fieldName)) {
          delete this.model[rule.fieldName];
        }
      });
      this.rules = newRules;

      if (this.siretFieldIsAvailable()) {
        this.formatSiretRules(newRules);
      }
    });
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

      return this.updateRules();
    }
    return null;
  }

  // compare original model to edited model
  hasChanges() {
    return !angular.equals(this.originalModel, this.model);
  }

  siretFieldIsAvailable() {
    const isSiretEnterprise =
      this.model.legalform === USER_TYPE_ENTERPRISE &&
      this.model.country === 'FR';
    if (
      isSiretEnterprise &&
      this.fieldToFocus &&
      !this.model.companyNationalIdentificationNumber
    ) {
      this.$anchorScroll(this.fieldToFocus);
    }
    return isSiretEnterprise;
  }

  determineIsEditionDisabledByKyc(kycRequest) {
    this.isEditionDisabledByKyc =
      this.user.kycValidated ||
      [KYC_STATUS.OPEN, KYC_STATUS.OK].includes(kycRequest.status);
  }
}
