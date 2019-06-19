import find from 'lodash/find';
import get from 'lodash/get';
import has from 'lodash/has';
import isFunction from 'lodash/isFunction';
import keyBy from 'lodash/keyBy';
import map from 'lodash/map';
import set from 'lodash/set';

import {
  ENUM_TRANSLATION_RULES,
  MODEL_DEBOUNCE_DELAY,
} from './form.constants';
import { WatchableModel } from '../class';

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
            label = this.$translate.instant(`sign_up_form_enum_${this.model.country.toUpperCase()}_${(translationRules.fallbackFieldName || translationRules.fieldName).toLowerCase()}_${value}`);
          } else {
            label = this.$translate.instant(`sign_up_form_enum_${(translationRules.fallbackFieldName || translationRules.fieldName).toLowerCase()}_${value}`);
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
            } if (valB.value === rule.defaultValue) {
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

    return this.signUp
      .getCreationRules(this.model, this.getRulesCancel)
      .then((rules) => {
        this.rules = keyBy(this.translateEnumRules(rules), 'fieldName');
        if (isFunction(this.onRulesUpdated())) {
          this.onRulesUpdated()(this.rules);
        }
      })
      .catch((error) => {
        if (error.xhrStatus) {
          return false;
        }
        // @TODO: manage error
        return error;
      });
  }

  initModel() {
    this.model = {};
    // define model from GET /me
    const meCopy = Object.assign({}, this.me);
    // and remove some unecessary attributes
    delete meCopy.state;
    delete meCopy.currency;
    delete meCopy.customerCode;
    delete meCopy.nichandle;
    // define model properties
    Object.keys(meCopy).forEach((key) => {
      Object.defineProperty(this.model, `$${key}`, {
        enumerable: false,
        value: new WatchableModel(
          get(meCopy, key),
          this.getRules.bind(this),
          MODEL_DEBOUNCE_DELAY,
        ),
      });

      Object.defineProperty(this.model, key, {
        enumerable: true,
        get: () => get(this.model, `$${key}.value`),
        set: newValue => set(this.model, `$${key}.value`, newValue),
      });
    });
    // add some informations
    set(this.model, 'action', this.action);
  }

  /* ============================
  =            Hooks            =
  ============================= */

  $onInit() {
    this.initModel();

    return this.getRules();
  }

  /* -----  End of Hooks  ------ */
}
