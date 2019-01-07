import angular from 'angular';
import _ from 'lodash';

import {
  ENUMS_TO_TRANSFORM,
  PREDIFINED_CONTACT_PROFILES,
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

    this.model = {
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
    _.keys(rules).forEach((ruleKey) => {
      if (!_.has(rules, `${ruleKey}.fullType`)) {
        OvhContactsFormCtrl.traverseRules(_.get(rules, ruleKey), callback, ruleKey);
      } else {
        callback(_.get(rules, ruleKey), prefix ? `${prefix}.${ruleKey}` : ruleKey);
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
        if (_.startsWith(phoneNumberParam, alternativePhonePrefix)) {
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
    return this.getRules().then(this.setPhonePlaceholder.bind(this));
  }

  /* ----------  Helpers  ---------- */

  getPhoneNumber(newPhoneModel) {
    if (angular.isDefined(newPhoneModel)) {
      this.model.phone.number = newPhoneModel;

      this.model.contact.phone = OvhContactsFormCtrl.cleanPhoneNumber(
        newPhoneModel,
        this.rules.phone.prefix,
      );
    }

    return this.model.phone.number;
  }

  validatePhoneNumber() {
    if (this.rules.phone.regularExpression) {
      return new RegExp(this.rules.phone.regularExpression)
        .test(this.model.contact.phone);
    }
    return true;
  }

  setPhoneCountry() {
    if (!this.model.contact.phone) {
      this.model.phone.country = this.model.contact.address.country;
      this.setPhonePlaceholder();
    }
  }

  setPhonePlaceholder() {
    this.placeholders.phone = _.head(_.get(this.rules, 'phone.examples', []));
  }

  getProvinceLabel(forLabel) {
    let areaTranslationKey = forLabel ? 'ovh_contact_form_address_area' : 'ovh_contact_form_address_area_optional';
    if (['US', 'WE'].indexOf(this.model.contact.address.country) > -1) {
      areaTranslationKey = forLabel ? 'ovh_contact_form_address_state' : 'ovh_contact_form_address_state_optional';
    } else if (this.model.contact.address.country === 'CA') {
      areaTranslationKey = forLabel ? 'ovh_contact_form_address_province' : 'ovh_contact_form_address_province_optional';
    }

    return this.$translate.instant(areaTranslationKey);
  }

  getRules() {
    const predifinedFields = _.get(PREDIFINED_CONTACT_PROFILES, this.predifinedProfile, null);

    return this.ovhContacts.getCreationRules({
      country: this.model.contact.address.country,
      phoneCountry: this.model.phone.country,
    }, predifinedFields)
      .then((rules) => {
        this.rules = rules;

        // set initial default value and initial model
        if (!this.initialDefaultValues) {
          this.initialDefaultValues = {};
          OvhContactsFormCtrl.traverseRules(rules, (rule, ruleKey) => {
            if (rule.defaultValue) {
              _.set(this.initialDefaultValues, ruleKey, rule.defaultValue);
              _.set(this.model.contact, ruleKey, rule.defaultValue);
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
        _.filter(ENUMS_TO_TRANSFORM, { sort: true }).forEach((enumDef) => {
          if (_.has(rules, enumDef.path)) {
            const sortedEnum = _.get(rules, `${enumDef.path}.enum`, []).sort((valA, valB) => {
              if (valA.value === _.get(this.initialDefaultValues, enumDef.path)) {
                return -1;
              } if (valB.value === _.get(this.initialDefaultValues, enumDef.path)) {
                return 1;
              }
              return valA.label.localeCompare(valB.label);
            });

            _.set(rules, `${enumDef.path}.enum`, sortedEnum);
          }
        });

        return this.rules;
      });
  }

  /* ----------  Controller initialization  ---------- */

  $onInit() {
    this.loading.init = true;

    return this.getRules()
      .catch((error) => {
        this.alerter.type = 'error';
        this.alerter.message = [
          this.$translate.instant('ovh_contact_form_load_error'),
          _.get(error, 'message.data', ''),
        ].join(' ');
      })
      .finally(() => {
        this.loading.init = false;
      });
  }
}
