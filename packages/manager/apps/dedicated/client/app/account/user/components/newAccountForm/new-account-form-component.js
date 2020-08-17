import clone from 'lodash/clone';
import forEach from 'lodash/forEach';
import filter from 'lodash/filter';
import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import flatten from 'lodash/flatten';
import get from 'lodash/get';
import includes from 'lodash/includes';
import indexOf from 'lodash/indexOf';
import keys from 'lodash/keys';
import map from 'lodash/map';
import omit from 'lodash/omit';
import pick from 'lodash/pick';
import values from 'lodash/values';

import { Environment, LANGUAGES } from '@ovh-ux/manager-config';

angular.module('ovhSignupApp').component('newAccountForm', {
  bindings: {
    model: '<',
    readonly: '<',
    onSubmit: '&', // on create callback
    onCancel: '&', // on cancel callback
  },
  template: '<div data-ng-include="getTemplateUrl()"></div>',
  controller: [
    '$scope',
    '$q',
    '$http',
    '$timeout',
    'coreConfig',
    'NewAccountFormConfig',
    'Alerter',
    'UserAccount.constants',
    'userAccountServiceInfos',
    '$translate',
    function newAccountFormController(
      $scope,
      $q,
      $http,
      $timeout,
      coreConfig,
      NewAccountFormConfig,
      Alerter,
      UserAccountConstants,
      UserAccountServiceInfos,
      $translate,
    ) {
      this.isLoading = false; // true when fetching data from api
      this.initError = null; // initialization error if any
      this.submitError = null;
      this.model = this.model || {}; // form model
      this.readonly = this.readonly || [];
      this.rules = null;
      this.isSubmitting = false;
      this.originalManagerLanguage = Environment.getUserLocale();
      const CONSENT_MARKETING_EMAIL_NAME = 'consent-marketing-email';

      $scope.getTemplateUrl = () =>
        'account/user/components/newAccountForm/new-account-form-component.html';

      this.$onInit = () => {
        // backup of original model
        this.originalModel = angular.copy(this.model);

        this.loaded = false;
        return $q
          .all({
            rules: this.fetchRules(this.model),
          })
          .then((result) => {
            this.rules = result.rules;
            this.loaded = true;
          })
          .catch((err) => {
            this.initError =
              get(err, 'data.message') || get(err, 'message') || err;
          });
      };

      // initialize rules with /me data
      this.initializeRulesWithOriginalModel = (rules) => {
        forEach(this.originalModel, (value, key) => {
          const rule = find(rules, { fieldName: key });
          if (rule) {
            rule.initialValue = value;
          }
        });
        return rules;
      };

      // return the list of rules from api
      this.fetchRules = (_params) => {
        let params = _params;
        const { customerCode } = params;
        let consentDecision = null;

        // we don't want to send attributes outside of /rules
        if (this.rules) {
          params = pick(this.model, map(this.rules, 'fieldName'));
        }

        // customer code does not belong to /rules, only displayed in the form
        params = omit(params, 'customerCode');
        params = omit(params, 'commercialCommunicationsApproval');
        params = omit(params, 'managerLanguage');

        this.isLoading = true;

        return UserAccountServiceInfos.fetchConsentDecision(
          CONSENT_MARKETING_EMAIL_NAME,
        )
          .then((fetchedConsentDecision) => {
            consentDecision = get(fetchedConsentDecision, 'value', false);
          })
          .then(() =>
            $http.post(
              `${UserAccountConstants.swsProxyRootPath}newAccount/rules`,
              params,
            ),
          )
          .then((result) => {
            if (result.status !== 200) {
              return $q.reject(result);
            }

            let emailFieldIndex;

            // hide rules that are not editable
            const rules = map(result.data, (rule, index) => {
              const editedRule = clone(rule);

              // rule is editable if not in the "this.readonly" list of fields.
              // The "email" field is a special case should. It should never be readonly.
              if (editedRule.fieldName === 'email') {
                emailFieldIndex = index;
                editedRule.readonly = false;
                editedRule.hasBottomMargin = coreConfig.getRegion() === 'US';
              } else {
                editedRule.readonly = includes(
                  this.readonly,
                  editedRule.fieldName,
                );
                editedRule.hasBottomMargin = true;
              }

              return editedRule;
            });

            if (coreConfig.getRegion() !== 'US') {
              rules.splice(emailFieldIndex + 1, 0, {
                in: null,
                mandatory: false,
                defaultValue: null,
                initialValue: consentDecision,
                fieldName: 'commercialCommunicationsApproval',
                fieldType: 'checkbox',
                tracking: {
                  name: 'ovh_products_consent',
                  type: 'action',
                  chapter1: 'account',
                  chapter2: 'myaccount',
                  chapter3: 'consent',
                },
                regularExpression: null,
                prefix: null,
                examples: null,
                hasBottomMargin: true,
              });
            }

            return rules;
          })
          .then(this.initializeRulesWithOriginalModel)
          .then((rules) => {
            // customer code does not belong to /rules, only displayed in the form
            rules.unshift({
              fieldName: 'customerCode',
              mandatory: true,
              initialValue: customerCode || '-',
              hasBottomMargin: true,
            });

            const languageRuleIdx = findIndex(rules, { fieldName: 'language' });
            if (languageRuleIdx >= 0) {
              rules.splice(languageRuleIdx + 1, 0, {
                fieldName: 'managerLanguage',
                mandatory: true,
                initialValue: Environment.getUserLocale(),
                in: map(LANGUAGES.available, 'key'),
                hasBottomMargin: true,
              });
            }

            return rules;
          })
          .finally(() => {
            this.isLoading = false;
          });
      };

      // on form submit callback
      this.submit = () => {
        this.isSubmitting = true;
        this.submitError = null;

        // we don't want to send attributes outside of /rules
        let model = pick(this.model, map(this.rules, 'fieldName'));

        // we need to blank out some values for api to be happy
        forEach(keys(this.originalModel), (field) => {
          // attributes not in /rules and not readonly are blanked out
          if (
            !find(this.rules, { fieldName: field }) &&
            this.readonly.indexOf(field) < 0
          ) {
            model[field] = null;
          }
        });

        // nullify empty values
        forEach(model, (value, key) => {
          if (!model[key]) {
            model[key] = null;
          }
        });

        // customer code does not belong to /rules, only displayed in the form
        model = omit(model, 'customerCode');

        // put on /me does not handle email modification
        model = omit(model, 'email');
        model = omit(model, 'commercialCommunicationsApproval');
        model = omit(model, 'managerLanguage');

        let promise = $http
          .put(`${UserAccountConstants.swsProxyRootPath}me`, model)
          .then((result) => {
            if (result.status !== 200) {
              return $q.reject(result);
            }
            return result;
          });

        if (this.originalModel.email !== this.model.email) {
          promise = promise
            .then(() => UserAccountServiceInfos.changeEmail(this.model.email))
            .then(
              () =>
                $timeout(
                  angular.noop,
                  3000,
                ) /* add some delay for task creation */,
            );
        }

        if (
          this.originalModel.commercialCommunicationsApproval !==
            this.model.commercialCommunicationsApproval &&
          coreConfig.getRegion() !== 'US'
        ) {
          promise = promise
            .then(() =>
              UserAccountServiceInfos.updateConsentDecision(
                CONSENT_MARKETING_EMAIL_NAME,
                this.model.commercialCommunicationsApproval || false,
              ),
            )
            .then(
              () =>
                $timeout(
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
              Environment.setUserLocale(this.model.managerLanguage);
              window.location.reload();
            } else if (this.onSubmit) {
              this.onSubmit();
            }
          })
          .catch((err) => {
            this.submitError = err;
            Alerter.alertFromSWS(
              $translate.instant('user_account_info_error'),
              {
                type: 'ERROR',
                message: get(err, 'data.message'),
              },
              'InfoErrors',
            );
          })
          .finally(() => {
            this.isSubmitting = false;
          });
      };

      this.cancel = () => {
        if (this.onCancel) {
          this.onCancel();
        }
      };

      // return the list of form fieldsets
      this.getSections = () => keys(NewAccountFormConfig.sections);

      // return the list of fields for a given fieldset name
      // readonly rules are not returned because they are not editable
      this.getRulesBySection = (section) => {
        // special section to handle fields that does not belong to any section
        if (section === 'other') {
          return filter(this.rules, (rule) => {
            const allFields = flatten(values(NewAccountFormConfig.sections));
            return indexOf(allFields, rule.fieldName) < 0 && !rule.readonly;
          });
        }

        const fields = NewAccountFormConfig.sections[section];
        return filter(
          this.rules,
          (rule) => indexOf(fields, rule.fieldName) >= 0 && !rule.readonly,
        );
      };

      // return the section of a given rule
      this.getSectionOfRule = (rule) => {
        let found = null;
        forEach(NewAccountFormConfig.sections, (fieldNames, section) => {
          if (!found && indexOf(fieldNames, rule.fieldName) >= 0) {
            found = section;
          }
        });
        return found || 'other';
      };

      this.updateRules = () =>
        this.fetchRules(this.model).then((newRules) => {
          forEach(this.rules, (rule) => {
            if (!find(newRules, { fieldName: rule.fieldName })) {
              delete this.model[rule.fieldName];
            }
          });
          this.rules = newRules;
        });

      // callback for when user changed a form field value
      this.onFieldChange = (rule, value) => {
        if (value !== this.model[rule.fieldName]) {
          // update model
          this.model[rule.fieldName] = value;

          this.updateRules();
        }
      };

      // compare original model to edited model
      this.hasChanges = () => !angular.equals(this.originalModel, this.model);
    },
  ],
});
