import find from 'lodash/find';
import get from 'lodash/get';
import has from 'lodash/has';
import isFunction from 'lodash/isFunction';
import keyBy from 'lodash/keyBy';
import map from 'lodash/map';
import merge from 'lodash/merge';
import set from 'lodash/set';

import { ENUM_TRANSLATION_RULES, MODEL_DEBOUNCE_DELAY } from './form.constants';
import { WatchableModel } from '../watchableModel.class';

export default class SignUpFormCtrl {
  /* @ngInject */
  constructor($q, $translate, signUp) {
    // dependencies injections
    this.$q = $q;
    this.$translate = $translate;
    this.signUp = signUp;

    // other attributes used in view
    this.model = null;
    this.rules = null;
    this.getRulesCancel = $q.defer();
  }

  translateEnumRules(creationRules) {
    ENUM_TRANSLATION_RULES.forEach((translationRules) => {
      const rule = find(creationRules, {
        fieldName: translationRules.fieldName,
      });
      if (rule && has(rule, 'in')) {
        let label;
        rule.in = map(rule.in, (value) => {
          if (translationRules.dependsOfCountry) {
            label = this.$translate.instant(
              `sign_up_form_enum_${this.model.country.toUpperCase()}_${(
                translationRules.fallbackFieldName || translationRules.fieldName
              ).toLowerCase()}_${value}`,
            );
          } else {
            label = this.$translate.instant(
              `sign_up_form_enum_${(
                translationRules.fallbackFieldName || translationRules.fieldName
              ).toLowerCase()}_${value}`,
            );
          }
          return {
            label,
            value,
          };
        });

        if (translationRules.sort) {
          rule.in.sort((valA, valB) => {
            if (valA.value === rule.defaultValue) {
              return -1;
            }
            if (valB.value === rule.defaultValue) {
              return 1;
            }
            return valA.label.localeCompare(valB.label);
          });
        }
      }
    });
    return creationRules;
  }

  getRules() {
    if (this.getRulesCancel) {
      this.getRulesCancel.resolve();
      this.getRulesCancel = this.$q.defer();
    }

    const ruleParams = merge(
      {
        action: this.action,
      },
      this.model,
    );

    const legalformOrder = {
      corporation: 0,
      individual: 1,
      administration: 2,
      association: 3,
      other: 4,
    };

    return this.signUp
      .getCreationRules(ruleParams, this.getRulesCancel)
      .then((rules) => {
        this.rules = keyBy(this.translateEnumRules(rules), 'fieldName');
        // set default values to model
        Object.keys(this.model).forEach((modelKey) => {
          const modelValue = get(this.model, modelKey);
          if (!modelValue || modelValue === 'UNKNOWN') {
            const defaultValue = get(this.rules, `${modelKey}.defaultValue`);
            const enumValues = get(this.rules, `${modelKey}.in`);
            if (defaultValue) {
              set(this.model, modelKey, defaultValue);
            } else if (enumValues && enumValues.length === 1) {
              set(
                this.model,
                modelKey,
                get(this.rules, `${modelKey}.in[0].value`),
              );
            }
          }
        });

        this.rules.legalform.in.sort(
          (a, b) => legalformOrder[a.value] - legalformOrder[b.value],
        );

        if (isFunction(this.onRulesUpdated())) {
          this.onRulesUpdated()({
            rules: this.rules,
          });
        }
      })
      .catch((error) => {
        if (error.xhrStatus === 'abort') {
          return false;
        }

        if (isFunction(this.onRulesUpdated())) {
          this.onRulesUpdated()({
            error: error.data,
          });
        }

        return error;
      });
  }

  /**
   *  Define the model with the values from the response of GET /me.
   *  Be sure to take only the attributes from the available post params of POST /newAccount/rules
   *  to avoid errors on POST.
   */
  initModel(postParams) {
    this.model = {};

    postParams.forEach(({ name }) => {
      Object.defineProperty(this.model, `$${name}`, {
        enumerable: false,
        value: new WatchableModel(
          get(this.me, name),
          this.getRules.bind(this),
          MODEL_DEBOUNCE_DELAY,
        ),
      });

      Object.defineProperty(this.model, name, {
        enumerable: true,
        get: () => get(this.model, `$${name}.value`),
        set: (newValue) => set(this.model, `$${name}.value`, newValue),
      });
    });
  }

  /* ============================
  =            Hooks            =
  ============================= */

  $onInit() {
    return this.signUp.getCreationRulesParams().then((params) => {
      this.initModel(params);
      set(this.me, 'model', this.model);
      return this.getRules();
    });
  }

  /* -----  End of Hooks  ------ */
}
