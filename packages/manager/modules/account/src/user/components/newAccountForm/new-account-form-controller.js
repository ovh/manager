import clone from 'lodash/clone';
import find from 'lodash/find';
import flatten from 'lodash/flatten';
import pick from 'lodash/pick';
import values from 'lodash/values';
import { LANGUAGES } from '@ovh-ux/manager-config';

import {
  CONSENT_MARKETING_EMAIL_NAME,
  CONSENT_RESYNC_EVENT,
  FIELD_NAME_LIST,
  PIXEL_TRACKING_RESET_EVENT,
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
import {
  buildConsentDecisionPayload,
  isPixelTrackingCountry,
  readPixelConsent,
} from './pixel-tracking-consent';
import { KYC_STATUS } from '../../../identity-documents/user-identity-documents.constant';
import { SUPPORT_URLS } from '../../user.constants';

// rendered by its dedicated component inside the siret block, never by the
// generic section loop
const EINVOICING_FIELD_NAME = 'einvoicingBillingAddress';

// Alerter container the form's API errors are pushed to (see the ovh-alert
// directive in the template).
const INFO_ERRORS_CONTAINER = 'InfoErrors';
// Broadcast by the siret component once the customer validated a company.
const COMPANY_SELECTED_EVENT = 'siret:companySelected';

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
    this.pixelConsentDecision = null;

    // Validating a company in the SIRET lookup replaces the data the API
    // complained about, so its errors no longer describe the form.
    this.$scope.$on(COMPANY_SELECTED_EVENT, () => this.clearApiErrors());

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
        // pixel.value drives the checkbox; pixel.history is the CNIL audit
        // trail, not a UI need — never read it.
        //
        // Captured ONCE, on the first read. fetchRules re-runs on every field
        // change, but a checkbox already on screen is never repainted by it:
        // the rendered state is the field component's own local copy, set at
        // its $onInit from rule.initialValue and never watched afterwards. So
        // re-reading here would only desynchronise the two — a decision
        // granted in another tab would become the submit-time fallback for a
        // box the customer still sees unchecked, and saving any other field
        // would write a consent the screen does not show. Keeping the loaded
        // state means what is submitted is always what was displayed.
        // resyncConsentDecisions is the one thing that moves it afterwards,
        // and it repaints both boxes in the same breath.
        if (this.pixelConsentDecision === null) {
          this.pixelConsentDecision = readPixelConsent(email);
        }
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
          // Pixel tracking, France + Italy only. Located by fieldName rather
          // than by reusing emailFieldIndex, so the two splices above keep
          // their arithmetic untouched. The splice position is cosmetic
          // anyway: the display order is imposed by FIELD_NAME_LIST (the sort
          // further down) and the fieldset by SECTIONS.contact.
          //
          // The gate is a LIVE read of the country the form currently shows
          // (see the getter), never a value frozen at load: the country select
          // is editable here, so the checkbox has to follow it. fetchRules
          // re-runs on every field change, and this rule is rebuilt — or left
          // out — against the country of that very moment.
          //
          // Leaving it out takes the unsaved pixel choice with it, through
          // updateRules()' `delete this.model[fieldName]` loop, and that is the
          // point rather than a side effect: a checkbox the customer can no
          // longer see must not travel in the submit payload. Coming back into
          // scope rebuilds the box from initialValue below — the decision the
          // GET returned — never from the discarded click.
          //
          // This is where it differs from commercialCommunicationsApproval and
          // smsConsent, which are injected unconditionally and so can never
          // meet that delete loop.
          if (this.isPixelTrackingAvailable) {
            const emailConsentIndex = rules.findIndex(
              (injected) =>
                injected.fieldName ===
                FIELD_NAME_LIST.commercialCommunicationsApproval,
            );
            rules.splice(emailConsentIndex + 1, 0, {
              in: null,
              mandatory: false,
              // never a defaultValue: setDefaultValue() writes into the parent
              // model at init and would dirty the form. Business rule 1 — no
              // default consent, the box loads unchecked unless the API says
              // otherwise.
              defaultValue: null,
              // reflects pixel.value from the GET: checked if true, unchecked
              // if false (setInitialValue's guard is truthy-only, and an unset
              // local value renders unchecked — the same thing on screen)
              initialValue: this.pixelConsentDecision,
              fieldName: FIELD_NAME_LIST.pixelTrackingConsent,
              fieldType: 'checkbox',
              regularExpression: null,
              prefix: null,
              examples: null,
              hasBottomMargin: true,
              // The label names the mailbox the pixels would measure, so the
              // rule has to carry one — and it is the REGISTERED address, not
              // the live this.model.email. An address typed into the email
              // field above is not receiving anything yet: submit() routes it
              // through changeEmail(), a procedure the customer still has to
              // confirm from the CURRENT mailbox. Naming it here would state
              // something untrue for as long as the change is pending, and
              // would rewrite the sentence under the customer's eyes on every
              // keystroke, since a field change refreshes the rules.
              //
              // The only rule that declares translateValues. Every other field
              // leaves it undefined, which is what the label's
              // `| translate:undefined` already resolves to today, so no other
              // label changes.
              translateValues: { email: this.originalModel?.email },
              // Business rule 9: the API refuses pixel consent without email
              // consent and fails the whole request, so the combination has to
              // be unreachable in the UI — we never leave the box enabled and
              // lean on the 400. The field template already binds this as
              // data-disabled="$ctrl.rule.disabled()", and the one-way binding
              // re-evaluates it on every digest pass, so it follows the other
              // checkbox with no event and no watcher of its own. Keep it
              // pure, cheap and allocation-free.
              // Deliberately NO descriptionKey: the box renders exactly like
              // the marketing-email checkbox above it, with nothing under the
              // label. The field template interpolates '' when the key is
              // absent, which leaves ouiCheckbox's hasDescription() false and
              // renders no description element at all.
              //
              // The trade-off, should it ever need revisiting: disabled()
              // greys the box out without saying why, and ouiCheckbox wired
              // that reason to the input's aria-describedby, so a screen
              // reader now announces the box unavailable with no explanation.
              disabled: () => !this.isEmailConsentGranted(),
            });
          }
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
        INFO_ERRORS_CONTAINER,
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
    // param) but accepted by PUT /me — re-add the selected address (RG5).
    // When the customer moved to a SIRET without e-invoicing address the picker
    // cleared the model: the attribute must still be sent, as an empty string,
    // otherwise PUT /me keeps the address of the previous SIRET and rejects the
    // update (the stored address is not assignable to the new SIRET).
    if (this.model[EINVOICING_FIELD_NAME]) {
      model[EINVOICING_FIELD_NAME] = this.model[EINVOICING_FIELD_NAME];
    } else if (this.originalModel[EINVOICING_FIELD_NAME]) {
      model[EINVOICING_FIELD_NAME] = '';
    }

    // PUT /me only accepts an empty string or a VAT validated by
    // /newAccount/rules: the "no VAT" checkbox (siret component) and the
    // blanking above both set it to null, which the API rejects
    const hasVatRule = (this.rules || []).some(
      (rule) => rule.fieldName === FIELD_NAME_LIST.vat,
    );
    if (hasVatRule || FIELD_NAME_LIST.vat in model) {
      model[FIELD_NAME_LIST.vat] = model[FIELD_NAME_LIST.vat] || '';
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
          tracking.accountEmailConsent = this.isEmailConsentGranted()
            ? 'opt-in'
            : 'opt-out';
          if (this.isPixelTrackingAvailable) {
            tracking.accountPixelConsent = this.isPixelConsentGranted()
              ? 'opt-in'
              : 'opt-out';
          }
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
    // Both checkbox states go out in ONE request rather than two sequential
    // calls: the campaign's PUT takes them together and applies the email
    // decision first, so the pair can never be refused; it reads clearer and
    // it saves a round trip. Which means the guard has to fire when EITHER
    // value changed — keyed on the email value alone, as it was, a pixel-only
    // change would send nothing at all.
    //
    // isEmailConsentAvailable gates the pair because it is literally the same
    // request: the pixel decision is a field of the marketing-email campaign
    // and cannot have a flag of its own without splitting that request.
    const hasEmailConsentChange =
      this.originalModel.commercialCommunicationsApproval !==
      this.model.commercialCommunicationsApproval;
    const hasPixelConsentChange =
      this.isPixelTrackingAvailable &&
      this.originalModel[FIELD_NAME_LIST.pixelTrackingConsent] !==
        this.model[FIELD_NAME_LIST.pixelTrackingConsent];
    if (
      this.isEmailConsentAvailable &&
      (hasEmailConsentChange || hasPixelConsentChange)
    ) {
      consentRequests.push(
        this.userAccountServiceInfos
          .updateConsentDecision(
            CONSENT_MARKETING_EMAIL_NAME,
            // isEmailConsentGranted(), not `this.model.x || false`: a
            // pixel-only change leaves the email model key untouched, and
            // sending false for it would revoke the customer's email consent
            // as a side effect — and cascade the pixel decision back to denied
            buildConsentDecisionPayload({
              hasEmailConsent: this.isEmailConsentGranted(),
              isPixelTrackingAvailable: this.isPixelTrackingAvailable,
              hasPixelConsent: this.isPixelConsentGranted(),
            }),
          )
          .catch((error) => this.resyncConsentDecisions(error)),
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
        this.refreshEinvoicingAddressOnError(err);
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
          INFO_ERRORS_CONTAINER,
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
  /**
   * A submit error never names the field the API rejected. Refresh the rules so
   * the directory's current view is loaded, but leave the selected address
   * alone: only a refreshed list that offers other addresses without this one is
   * evidence against it (RG6). An error raised by any other field — a company
   * address the API refuses, typically — must not cost the customer a choice the
   * API never pointed at. An answer with no address at all is not evidence
   * either, see the picker's getAddresses.
   */
  refreshEinvoicingAddressOnError(err) {
    const submitted = this.model[EINVOICING_FIELD_NAME];
    if (err?.status !== 400 || !submitted) {
      return null;
    }
    return this.updateRules().then(() => {
      const offered = (this.getEinvoicingRule()?.in || []).filter(Boolean);
      if (offered.length && !offered.includes(submitted)) {
        this.$scope.$broadcast('einvoicing.staleAddress');
      }
    });
  }

  /**
   * The UI never builds { value: false, pixel: { value: true } } — the
   * disabled rule makes it unreachable by clicking and
   * buildConsentDecisionPayload clamps it away — but a page left open while
   * email consent was revoked in another tab can still submit it, and the API
   * answers 400 ("pixel tracking requires marketing email consent to be
   * granted") having written NOTHING: email consent is not revoked either.
   *
   * Trusting the optimistic state after that would leave two checkboxes
   * showing something the server refused, so re-fetch the decision with a GET
   * and re-render both boxes from the fresh answer. Repainting needs the
   * broadcast: the rendered value is the field component's own local copy,
   * setInitialValue() runs only at $onInit behind a truthy-only guard, and the
   * ng-repeat tracks by fieldName — so a rules refresh cannot move it.
   *
   * Attached to the consent request's OWN catch, not to submit()'s shared one:
   * an unrelated 400 (a VAT the API refuses, typically) must not throw away
   * the customer's consent choices.
   *
   * A failed re-read is swallowed with angular.noop, and the error is always
   * re-rejected, so submit()'s catch still sets submitError and pushes the
   * InfoErrors banner with the API's own message.
   */
  resyncConsentDecisions(error) {
    // Scoped to the accounts the pixel checkbox exists for, and to the status
    // the contract documents. Out of the country scope the payload carries no
    // `pixel` key at all, so this route cannot answer the pixel/email 400 —
    // any 400 it does answer there belongs to the worldwide marketing-email
    // checkbox, which this epic does not touch. Recovering from it would
    // silently throw that customer's click away and repaint their box, where
    // today the error simply reaches submit()'s catch with the click intact
    // for the retry the banner invites.
    if (!this.isPixelTrackingAvailable || error?.status !== 400) {
      return this.$q.reject(error);
    }
    return this.userAccountServiceInfos
      .fetchConsentDecision(CONSENT_MARKETING_EMAIL_NAME)
      .then((decision) => {
        const hasEmailConsent = !!decision?.value;
        const hasPixelConsent = readPixelConsent(decision);
        this.consentDecision = hasEmailConsent;
        this.pixelConsentDecision = hasPixelConsent;
        // The refused choices must stop contradicting the server, so both keys
        // are SET to what the GET just returned — not deleted. Deleting reads
        // tidier (it also takes the form back to "unchanged" for the two
        // consents) but it desynchronises the model from the checkboxes this
        // very method is repainting, and it breaks the retry the error banner
        // invites: with the keys gone the submit guards compare undefined to
        // undefined and build no consent request at all, so pressing Save
        // again reports success having written nothing — and for an account
        // whose granted email consent DID reach originalModel, the guard fires
        // while isEmailConsentGranted() falls back to the decision just
        // re-read, re-granting the very consent the customer was revoking.
        // Assigning instead keeps model, checkbox and server in agreement, so
        // a retry is the redundant no-op write the contract calls safe.
        this.model.commercialCommunicationsApproval = hasEmailConsent;
        this.model[FIELD_NAME_LIST.pixelTrackingConsent] = hasPixelConsent;
        this.$scope.$broadcast(CONSENT_RESYNC_EVENT, {
          [FIELD_NAME_LIST.commercialCommunicationsApproval]: hasEmailConsent,
          [FIELD_NAME_LIST.pixelTrackingConsent]: hasPixelConsent,
        });
      })
      .catch(angular.noop)
      .then(() => this.$q.reject(error));
  }

  /**
   * Drops the errors the API raised against data the customer has since
   * replaced: the banner it pushed to the alert container, and the inline
   * message the form renders from submitError.
   */
  clearApiErrors() {
    this.submitError = null;
    this.Alerter.resetMessage(INFO_ERRORS_CONTAINER);
  }

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
        // The rules are refetched on every field change. An answer that drops
        // the e-invoicing entry — because another field is being refused —
        // would take the picker off the screen and delete the selected address
        // with it, for a field the API never pointed at: carry the entry over.
        // A company change brings a fresh entry instead, and the picker hides
        // itself anyway once the account stops being eligible.
        const previousEinvoicingRule = this.getEinvoicingRule();
        const rules =
          previousEinvoicingRule &&
          !newRules.find((rule) => rule.fieldName === EINVOICING_FIELD_NAME)
            ? [...newRules, previousEinvoicingRule]
            : newRules;
        (this.rules || []).forEach((rule) => {
          if (!rules.find((value) => value.fieldName === rule.fieldName)) {
            delete this.model[rule.fieldName];
          }
        });
        this.rules = rules;

        if (this.siretFieldIsAvailable()) {
          this.formatSiretRules(rules);
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
        // Cascade, mirroring the backend's own (business rule 9): revoking
        // marketing email consent unchecks AND disables pixel tracking in the
        // same UI update, so the form never shows a state the next GET would
        // contradict. disabled() greys the box out by itself; only this reset
        // clears the checkmark, because the rendered value is the field
        // component's local copy.
        //
        // There is deliberately NO `else`. Re-checking email is not the mirror
        // image (business rule 6): it only lifts disabled(), making the box
        // checkable again while it stays UNCHECKED. Re-subscribing to email
        // never restores pixel tracking — the customer opts back in
        // explicitly, one click per checkbox, no bundled toggle and no
        // "accept all" side effect.
        //
        // Gated on the country flag as well: out of scope no pixel rule was
        // ever built, so there is no field component listening and nothing to
        // ask for.
        if (this.isPixelTrackingAvailable && !value) {
          this.$scope.$broadcast(PIXEL_TRACKING_RESET_EVENT);
        }
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

      // Reached by a real click on the pixel checkbox AND by the cascade
      // above: the reset listener clears the box through the field's
      // onChange(), which routes back into this very method, so revoking
      // marketing email consent reports a `product-pixel-consent::disable`
      // the customer never clicked, and the `return this.updateRules()` below
      // fires a second, overlapping rules refresh for the one click.
      //
      // Left as is, deliberately: it is what the identical smsConsent cascade
      // does today (a phoneType change reports an sms-consent hit the same
      // way), the reported opt-out is a state change that genuinely happened,
      // and suppressing it means either a payload threaded through onChange()
      // or writing the model behind the field component's back — both worse
      // than the duplicate hit. Do not read the broadcast as a way of keeping
      // one click to one hit; it is not.
      if (rule.fieldName === FIELD_NAME_LIST.pixelTrackingConsent) {
        this.atInternet.trackClick({
          name: `${TRACKING_PREFIX}::product-pixel-consent::${
            value ? 'enable' : 'disable'
          }`,
          type: 'action',
          chapter1: 'account',
          chapter2: 'myaccount',
          chapter3: 'consent',
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

  /**
   * Country scope of the pixel-tracking checkbox: France (all of its
   * territory) and Italy, never anywhere else. Out of scope the rule is never
   * built at all — no unchecked box, no disabled box, nothing.
   *
   * Re-read from the LIVE model on every access, so it tracks the country
   * select as the customer edits it: an Italian account that switches to
   * Germany loses the checkbox on that change, and switching back to Italy
   * brings it in again. onFieldChange() already refreshes the rules on a
   * country change (the FR_COUNTRIES gates further down work the same way),
   * so nothing else has to be wired for this to repaint.
   *
   * A getter, not a method, so all six read sites — the rule injection, the
   * two submit guards, the payload builder, the 400 recovery and the email
   * cascade — read the current country with no call site left to go stale.
   *
   * Fails closed, in isPixelTrackingCountry: a model with no country, or with
   * the 'UNKNOWN' placeholder, is not offered the checkbox.
   *
   * Permanent business scope, not a rollout: no feature flag guards it.
   */
  get isPixelTrackingAvailable() {
    return isPixelTrackingCountry(this.model?.country);
  }

  /**
   * A consent checkbox's loaded state lives in the field component's local
   * value (from rule.initialValue), never in the model, so
   * this.model.commercialCommunicationsApproval stays undefined until the
   * customer actually clicks it: an account that already consented reads as
   * undefined here while the box renders CHECKED. Falling back to the decision
   * the GET returned is what keeps the pixel checkbox enabled on load for
   * exactly the customers who are eligible for it.
   *
   * This is the fallback the submit-time tracking block used to carry inline;
   * it now uses this method, so the expression exists once.
   */
  isEmailConsentGranted() {
    return typeof this.model.commercialCommunicationsApproval !== 'undefined'
      ? !!this.model.commercialCommunicationsApproval
      : !!this.consentDecision;
  }

  // same undefined-until-clicked story as above
  isPixelConsentGranted() {
    return typeof this.model[FIELD_NAME_LIST.pixelTrackingConsent] !==
      'undefined'
      ? !!this.model[FIELD_NAME_LIST.pixelTrackingConsent]
      : !!this.pixelConsentDecision;
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

  // Sends the customer back to the SIRET lookup modal, which lives inside the
  // siret component (a descendant scope), from an error message rendered here.
  openSiretSearch() {
    this.$scope.$broadcast('siret:openSearchModal');
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
