import angular from 'angular';

// lodash imports
import filter from 'lodash/filter';
import get from 'lodash/get';
import has from 'lodash/has';
import head from 'lodash/head';
import keys from 'lodash/keys';
import set from 'lodash/set';
import startsWith from 'lodash/startsWith';

import {
  ENUMS_TO_TRANSFORM,
  PREDEFINED_CONTACT_PROFILES,
} from '../ovh-contacts.constants';

export default class OvhContactsFormCtrl {
  /* @ngInject */

  constructor($translate, ovhContacts) {
    // dependencies injections
    this.$translate = $translate;
    this.ovhContacts = ovhContacts;

    // other attributes used in view
    this.loading = {
      init: false,
    };

    this.models = {
      phone: {
        country: null,
        number: null,
        getterSetter: this.getPhoneNumber.bind(this),
        validator: {
          test: this.validatePhoneNumber.bind(this),
        },
      },
      contact: {
        address: {},
      },
    };

    this.placeholders = {
      phone: null,
    };

    this.rules = null;
    this.initialDefaultValues = null;
    this.alerter = {
      type: null,
      message: null,
    };
  }

  static traverseRules(rules, callback, prefix) {
    keys(rules).forEach((ruleKey) => {
      if (!has(rules, `${ruleKey}.fullType`)) {
        OvhContactsFormCtrl.traverseRules(get(rules, ruleKey), callback, ruleKey);
      } else {
        callback(get(rules, ruleKey), prefix ? `${prefix}.${ruleKey}` : ruleKey);
      }
    });
  }

  static cleanPhoneNumber(phoneNumberParam, phonePrefix) {
    let phoneNumber = phoneNumberParam;
    if (phoneNumberParam) {
      phoneNumber = phoneNumber.replace(/\s/g, '');
      phoneNumber = phoneNumber.replace(/(?:-)(\d)/g, '$1'); // remove "-" char preceding a digit
      phoneNumber = phoneNumber.replace(/(?:\.)(\d)/g, '$1'); // remove "." char preceding a digit
      phoneNumber = phoneNumber.replace(/(?:\()(\d+)(?:\))/g, '$1'); // remove parenthesis around digits

      if (phonePrefix) {
        const alternativePhonePrefix = `00${phonePrefix.replace('+', '')}`;
        if (startsWith(phoneNumberParam, alternativePhonePrefix)) {
          phoneNumber = `${phonePrefix}${phoneNumberParam.slice(alternativePhonePrefix.length)}`;
        }
      }
    }
    return phoneNumber;
  }

  /* ----------  Events  ---------- */

  onCountryChange() {
    return this.getRules().then(this.setPhoneCountry.bind(this));
  }

  onPhoneCountryChange() {
    return this.getRules().then(() => {
      // set the placeholder with new selected country prefix
      this.setPhonePlaceholder();

      // When phone country change, the pattern change too
      // But... the validation is not done automatically.
      // So... be sure that the phone validation is done.
      const phoneModel = this.formCtrl.phone;
      const modelValue = phoneModel.$modelValue;
      const viewValue = phoneModel.$viewValue;
      const phoneModelValid = phoneModel.$validators.pattern(modelValue, viewValue);
      phoneModel.$setValidity('pattern', phoneModelValid);

      // set the focus to phone field to fix error display
      this.setElementFocus('phone');
    });
  }

  /* ----------  Helpers  ---------- */

  getPhoneNumber(newPhoneModel) {
    if (angular.isDefined(newPhoneModel)) {
      this.models.phone.number = newPhoneModel;

      this.model.phone = OvhContactsFormCtrl.cleanPhoneNumber(
        newPhoneModel,
        this.rules.phone.prefix,
      );
    }

    return this.models.phone.number;
  }

  validatePhoneNumber() {
    if (this.rules.phone.regularExpression) {
      return new RegExp(this.rules.phone.regularExpression)
        .test(this.model.phone);
    }
    return true;
  }

  setPhoneCountry() {
    if (!this.model.phone) {
      this.models.phone.country = this.model.address.country;
      this.setPhonePlaceholder();
    }
  }

  setPhonePlaceholder() {
    this.placeholders.phone = head(get(this.rules, 'phone.examples', []));
  }

  getProvinceLabel(forLabel) {
    let areaTranslationKey = forLabel ? 'ovh_contact_form_address_area' : 'ovh_contact_form_address_area_optional';
    if (['US', 'WE'].indexOf(this.model.address.country) > -1) {
      areaTranslationKey = forLabel ? 'ovh_contact_form_address_state' : 'ovh_contact_form_address_state_optional';
    } else if (this.model.address.country === 'CA') {
      areaTranslationKey = forLabel ? 'ovh_contact_form_address_province' : 'ovh_contact_form_address_province_optional';
    }

    return this.$translate.instant(areaTranslationKey);
  }

  getRules() {
    const predefinedFields = get(PREDEFINED_CONTACT_PROFILES, this.predefinedProfile, null);

    return this.ovhContacts.getCreationRules({
      country: this.model.address.country,
      phoneCountry: this.models.phone.country,
    }, predefinedFields)
      .then((rules) => {
        this.rules = rules;

        // set initial default value and initial model
        if (!this.initialDefaultValues) {
          this.initialDefaultValues = {};
          OvhContactsFormCtrl.traverseRules(rules, (rule, ruleKey) => {
            if (ruleKey !== 'phoneCountry' && (rule.defaultValue || rule.initialValue)) {
              set(this.initialDefaultValues, ruleKey, rule.defaultValue);
              set(this.model, ruleKey, rule.initialValue || rule.defaultValue);
              if (ruleKey === 'address.country') {
                this.setPhoneCountry();
              }
            }
          });
        }

        return this.rules;
      })
      .then((rules) => {
        // sort the enums that need to be sorted
        filter(ENUMS_TO_TRANSFORM, { sort: true }).forEach((enumDef) => {
          if (has(rules, enumDef.path)) {
            const sortedEnum = get(rules, `${enumDef.path}.enum`, []).sort((valA, valB) => {
              if (valA.value === get(this.initialDefaultValues, enumDef.path)) {
                return -1;
              } if (valB.value === get(this.initialDefaultValues, enumDef.path)) {
                return 1;
              }
              return valA.label.localeCompare(valB.label);
            });

            set(rules, `${enumDef.path}.enum`, sortedEnum);
          }
        });

        return this.rules;
      });
  }

  /* ----------  Controller initialization  ---------- */

  $onInit() {
    this.loading.init = true;

    if (!this.model) {
      this.model = this.models.contact;
    }

    return this.getRules()
      .catch((error) => {
        this.alerter.type = 'error';
        this.alerter.message = [
          this.$translate.instant('ovh_contact_form_load_error'),
          get(error, 'message.data', ''),
        ].join(' ');
      })
      .finally(() => {
        this.loading.init = false;
      });
  }
}
