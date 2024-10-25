import find from 'lodash/find';
import get from 'lodash/get';
import head from 'lodash/head';
import isObject from 'lodash/isObject';
import map from 'lodash/map';
import startsWith from 'lodash/startsWith';
import { LANGUAGES } from '@ovh-ux/manager-config';
import {
  PHONE_PREFIX,
  MODEL_DEBOUNCE_DELAY,
  FIELD_NAME_LIST,
  USER_TYPE_ENTERPRISE,
} from '../new-account-form-component.constants';

export default class NewAccountFormFieldController {
  /* @ngInject */
  constructor(
    $filter,
    $locale,
    $scope,
    $timeout,
    $translate,
    atInternet,
    coreConfig,
  ) {
    this.$filter = $filter;
    this.$locale = $locale;
    this.$scope = $scope;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.FIELD_NAME_LIST = FIELD_NAME_LIST;
    this.user = coreConfig.getUser();
  }

  $onInit() {
    // Indian subsidiary changes
    this.disableInputField = this.canInputFieldDisabled();
    this.disableDropDownSelection = this.canDropDownDisabled();

    // unique field identifier
    this.id = `ovh_field_${this.rule.fieldName}`;

    // field value
    this.value = undefined;

    this.debounce = MODEL_DEBOUNCE_DELAY;
    // set default value
    this.setDefaultValue();

    // initialize value if rule has initialValue attribute
    this.setInitialValue();

    // cache for enum translations
    this.translatedEnumCache = null;

    // validate input on rule update
    this.$scope.$watch('$ctrl.rule', () => {
      this.translatedEnumCache = null;
      if (this.fieldset[this.id]) {
        this.fieldset[this.id].$validate();
      }
    });

    // handle email validation
    if (this.rule.fieldName === 'email') {
      this.$scope.$on('account.email.response.validity', (ev, isValid) => {
        if (this.value) {
          this.fieldset[this.id].$setValidity('emailAvailable', isValid);
        }
      });
    }

    // reset sms consent value when phone type is no longer 'mobile'
    if (this.rule.fieldName === 'smsConsent') {
      this.$scope.$on('account.smsConsent.reset', () => {
        // switch value to false only if it is true
        if (this.value) {
          this.onChange();
          this.value = false;
        }
      });
    }

    // handle special phone prefix case
    if (this.getFieldType() === 'phone') {
      this.$scope.$watch(
        '$ctrl.newAccountForm.rules',
        (rules) => {
          const rule = rules.find(
            (value) => value.fieldName === this.FIELD_NAME_LIST.phoneCountry,
          );
          this.phoneCountryList = rule?.in.map((country) => ({
            country,
            prefix: PHONE_PREFIX[country],
            label: this.$translate.instant(`signup_enum_country_${country}`),
          }));
          this.phoneCountryList = this.$filter('orderBy')(
            this.phoneCountryList,
            'label',
            false,
            (a, b) => String(a.value).localeCompare(String(b.value)),
          );

          const current = this.phoneCountryList.find(
            (value) => value.country === this.newAccountForm.model.phoneCountry,
          );
          const orig = this.phoneCountryList.find(
            (value) =>
              value.country === this.newAccountForm.originalModel.phoneCountry,
          );
          const country = this.phoneCountryList.find(
            (value) => value.country === this.newAccountForm.model.country,
          );
          const subCountry = this.phoneCountryList.find(
            (value) =>
              value.country === this.newAccountForm.model.ovhSubsidiary,
          );

          this.phoneCountry =
            current ||
            orig ||
            country ||
            subCountry ||
            head(this.phoneCountryList);

          if (current !== this.phoneCountry.country) {
            this.$timeout(() => {
              if (this.newAccountForm.onFieldChange) {
                this.newAccountForm.onFieldChange(
                  {
                    fieldName: this.FIELD_NAME_LIST.phoneCountry,
                  },
                  this.phoneCountry.country,
                );
              }
            });
          }
        },
        true,
      );
    }

    // validates input taking care of rule prefix and regularExpression
    this.inputValidator = {
      test: (_value) => {
        let value = _value;

        // normalize input to make it easier for the user
        // to type numbers (ignore spaces etc)
        if (this.isPhoneNumberField()) {
          value = NewAccountFormFieldController.cleanPhoneNumber(value);
        } else if (this.isGenericIdentifierField()) {
          value = NewAccountFormFieldController.cleanIdentifier(value);
        }

        if (this.rule.regularExpression) {
          if (
            this.rule.prefix &&
            value &&
            this.fieldName !== this.FIELD_NAME_LIST.zip
          ) {
            value = this.rule.prefix + value;
          }
          const regex = this.rule.regularExpression.replace(/\//g, '\\/');
          return new RegExp(regex).test(value);
        }
        if (this.rule.fieldName === this.FIELD_NAME_LIST.password) {
          return /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/.test(value);
        }
        if (this.rule.in) {
          if (this.rule.mandatory) {
            return value && this.rule.in.includes(value.key);
          }
          if (value) {
            return this.rule.in.includes(value.key);
          }
        }

        return true;
      },
    };
  }

  $onChanges({ isEditionDisabledByKyc }) {
    if (
      isEditionDisabledByKyc &&
      typeof isEditionDisabledByKyc.currentValue !== 'undefined'
    ) {
      // Indian subsidiary changes
      this.disableInputField = this.canInputFieldDisabled();
      this.disableDropDownSelection = this.canDropDownDisabled();
    }
  }

  // if rule has a default value, use it
  setDefaultValue() {
    if (this.rule.defaultValue && !this.rule.initialValue) {
      if (this.getFieldType() === 'select') {
        this.value = {
          key: this.rule.defaultValue,
          translated:
            this.rule.fieldName === this.FIELD_NAME_LIST.timezone
              ? this.rule.defaultValue
              : this.$translate.instant(
                  `signup_enum_${this.rule.fieldName}_${this.rule.defaultValue}`,
                ),
        };
        if (this.newAccountForm.onFieldChange) {
          this.newAccountForm.onFieldChange(
            this.rule,
            this.value.key,
            this.fieldset,
          );
        }
      } else {
        this.value = this.rule.defaultValue;
        if (this.newAccountForm.onFieldChange) {
          this.newAccountForm.onFieldChange(
            this.rule,
            this.value,
            this.fieldset,
          );
        }
      }
    }
  }

  // if rule has an initialValue, use it
  setInitialValue() {
    if (this.rule.initialValue) {
      let value = angular.copy(this.rule.initialValue);
      if (this.getFieldType() === 'select') {
        value = {
          key: value,
          translated:
            this.rule.fieldName === this.FIELD_NAME_LIST.timezone
              ? value
              : this.$translate.instant(
                  `signup_enum_${
                    this.rule.fieldName === this.FIELD_NAME_LIST.area
                      ? `${this.newAccountForm.model.country}_`
                      : ''
                  }${this.rule.fieldName}_${value}`,
                ),
        };
      } else if (this.getFieldType() === 'date') {
        value = moment(this.rule.initialValue, 'YYYY-MM-DD').toDate();
      } else if (this.rule.prefix && startsWith(value, this.rule.prefix)) {
        value = value.slice(this.rule.prefix.length);
      }
      this.value = value;
    }
  }

  // returns field type depending of current rule
  getFieldType() {
    if (this.rule.fieldType) {
      return this.rule.fieldType;
    }
    if (this.rule.fieldName === this.FIELD_NAME_LIST.phoneType) {
      return 'radio';
    }
    if (this.rule.in) {
      return 'select';
    }
    if (/email/.test((this.rule.fieldName || '').toLowerCase())) {
      return 'email';
    }
    if ((this.rule.fieldName || '') === this.FIELD_NAME_LIST.birthDay) {
      return 'date';
    }
    if (
      this.rule.fieldName === this.FIELD_NAME_LIST.phone &&
      find(this.newAccountForm.rules, {
        fieldName: this.FIELD_NAME_LIST.phoneCountry,
      })
    ) {
      return 'phone';
    }
    return 'text';
  }

  // returns translated list of rule enum values
  getTranslatedEnums() {
    if (this.translatedEnumCache) {
      return this.translatedEnumCache;
    }

    let result = map(this.rule.in || [], (value) => {
      let translated;
      if (
        this.rule.fieldName === this.FIELD_NAME_LIST.area &&
        this.newAccountForm.model.country
      ) {
        translated = this.$translate.instant(
          `signup_enum_${this.newAccountForm.model.country}_${this.rule.fieldName}_${value}`,
        );
      } else if (this.rule.fieldName === this.FIELD_NAME_LIST.timezone) {
        translated = value;
      } else if (this.rule.fieldName === this.FIELD_NAME_LIST.managerLanguage) {
        translated = get(find(LANGUAGES.available, { key: value }), 'name');
      } else {
        translated = this.$translate.instant(
          `signup_enum_${this.rule.fieldName}_${value}`,
        );
      }
      return {
        key: value,
        translated,
      };
    });

    result = this.$filter('orderBy')(
      result,
      'translated',
      this.rule.fieldName === this.FIELD_NAME_LIST.phoneType,
      (a, b) => String(a.value).localeCompare(String(b.value)),
    );

    // if there is only a single value, auto select it
    if (
      result.length === 1 &&
      this.value !== head(result).key &&
      !this.autoSelectPending
    ) {
      this.autoSelectPending = true;
      this.value = head(result);
      this.$timeout(() => {
        this.onChange();
        this.autoSelectPending = false;
      });
    }

    this.translatedEnumCache = result;
    return result;
  }

  // handle special area translation cases
  getTranslatedArea() {
    if (
      this.newAccountForm.model.country === 'US' ||
      this.newAccountForm.model.country === 'WE'
    ) {
      return this.$translate.instant('signup_field_state');
    }
    return this.$translate.instant('signup_field_area');
  }

  // true if current modified field is valid, false otherwise
  isValid() {
    const field = this.fieldset[this.id];
    return this.value && field && field.$valid;
  }

  // true if current field is dirty and invalid
  isInvalid() {
    const field = this.fieldset[this.id];
    return field && field.$invalid;
  }

  // returns a normalized identifier (skip spaces)
  static cleanIdentifier(_id) {
    let id = _id;
    if (id) {
      id = id.replace(/\s/g, '');
    }
    return id;
  }

  // returns a normalized phone number
  static cleanPhoneNumber(_number) {
    let number = _number;
    if (number) {
      number = number.replace(/\s/g, '');
      number = number.replace(/(?:-)(\d)/g, '$1'); // remove "-" char preceding a digit
      number = number.replace(/(?:\()(\d+)(?:\))/g, '$1'); // remove parenthesis around digits
    }
    return number;
  }

  // true if field is a generic identifier
  isGenericIdentifierField() {
    return [
      'vat',
      'nationalIdentificationNumber',
      'companyNationalIdentificationNumber',
    ].includes(this.rule.fieldName);
  }

  // true if field is a phone number
  isPhoneNumberField() {
    return ['phone', 'fax'].includes(this.rule.fieldName);
  }

  shouldDisplayLabel() {
    return !['checkbox', 'radio'].includes(this.getFieldType());
  }

  // callback for when model changed
  onChange() {
    let { value } = this;

    const fieldType = this.getFieldType();

    // normalize input to make it easier for the user
    // to type numbers (ignore spaces etc)
    if (this.isPhoneNumberField()) {
      value = NewAccountFormFieldController.cleanPhoneNumber(value);
    } else if (this.isGenericIdentifierField()) {
      value = NewAccountFormFieldController.cleanIdentifier(value);
    }
    if (fieldType === 'select') {
      value = value ? value.key : value;
    } else if (fieldType === 'date') {
      // avoids datepicker setting value to null
      if (!value) {
        this.newAccountForm.onFieldChange(this.rule, undefined, this.fieldset);
        return;
      }
      value = moment(value).format('YYYY-MM-DD');
    } else if (
      this.rule.prefix &&
      value &&
      this.rule.fieldName !== this.FIELD_NAME_LIST.zip
    ) {
      // only add prefix if value is defined
      value = this.rule.prefix + value;
    } else if (fieldType === 'checkbox') {
      value = !value;
    }

    // notify field changes
    if (this.newAccountForm.onFieldChange) {
      this.newAccountForm.onFieldChange(this.rule, value, this.fieldset);
    }

    // if email or ovhCompany changes, we need to check for email availability
    if (
      this.rule.fieldName === this.FIELD_NAME_LIST.email ||
      this.rule.fieldName === this.FIELD_NAME_LIST.ovhCompany
    ) {
      this.$scope.$emit('account.email.request.validity');
    }

    if (isObject(this.rule.tracking)) {
      this.atInternet.trackClick(this.rule.tracking);
    }
  }

  onPhonePrefixChange() {
    this.phonePrefixChanged = true;
    if (this.newAccountForm.onFieldChange) {
      this.newAccountForm.onFieldChange(
        {
          fieldName: this.FIELD_NAME_LIST.phoneCountry,
        },
        this.phoneCountry.country,
      );
    }
  }

  dateFormat() {
    return this.$locale.DATETIME_FORMATS.shortDate
      .replace('dd', 'd')
      .replace(/MM|M/g, 'm')
      .replace(/yy|y/g, 'Y');
  }

  /*
      Inputs of type text should be disabled if:
      - the input is for customer code
      - if the user in from an indian subsidiary:
          - his kyc request is in progress (isEditionDisabledByKyc)
          - the input is not for vat (if the customer is of type enterprise)
  */
  canInputFieldDisabled() {
    if (this.rule.fieldName === this.FIELD_NAME_LIST.customerCode) {
      return true;
    }
    return (
      this.isIndianSubsidiary &&
      this.isEditionDisabledByKyc &&
      !(
        (this.rule.fieldName === this.FIELD_NAME_LIST.vat &&
          this.user.legalform !== USER_TYPE_ENTERPRISE) ||
        this.rule.fieldName === this.FIELD_NAME_LIST.purposeOfPurchase
      )
    );
  }

  /*
      dropDown disability rules:
      if the user is from Indian subsidiary and field is country or area
      if the dropdown is legalform and if the user is from Indian subsidiary and is ENTERPRISE
  */
  canDropDownDisabled() {
    if (this.isIndianSubsidiary) {
      return (
        this.isEditionDisabledByKyc &&
        (this.rule.fieldName === this.FIELD_NAME_LIST.legalform ||
          this.rule.fieldName === this.FIELD_NAME_LIST.country ||
          this.rule.fieldName === this.FIELD_NAME_LIST.area)
      );
    }
    return false;
  }
}
