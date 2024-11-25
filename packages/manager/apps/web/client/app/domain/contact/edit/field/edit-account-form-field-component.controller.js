import find from 'lodash/find';
import get from 'lodash/get';
import head from 'lodash/head';
import isObject from 'lodash/isObject';
import map from 'lodash/map';
import startsWith from 'lodash/startsWith';
import {
  PHONE_PREFIX,
  MODEL_DEBOUNCE_DELAY,
  FIELD_NAME_LIST,
} from '../edit.constants';

export default class EditAccountFormFieldController {
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

    // unique field identifier
    this.id = `ovh_field_${this.rule.label}`;

    // field value
    this.value = undefined;

    this.debounce = MODEL_DEBOUNCE_DELAY;

    // set value
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
    if (this.rule.label === 'email') {
      this.$scope.$on('account.email.response.validity', (ev, isValid) => {
        if (this.value) {
          this.fieldset[this.id].$setValidity('emailAvailable', isValid);
        }
      });
    }

    // reset sms consent value when phone type is no longer 'mobile'
    if (this.rule.label === 'smsConsent') {
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
        '$ctrl.editAccountForm.rules',
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
            (value) => value.country === this.editAccountForm.model.phoneCountry,
          );
          const orig = this.phoneCountryList.find(
            (value) =>
              value.country === this.editAccountForm.originalModel.phoneCountry,
          );
          const country = this.phoneCountryList.find(
            (value) => value.country === this.editAccountForm.model.country,
          );
          const subCountry = this.phoneCountryList.find(
            (value) =>
              value.country === this.editAccountForm.model.ovhSubsidiary,
          );

          this.phoneCountry =
            current ||
            orig ||
            country ||
            subCountry ||
            head(this.phoneCountryList);

          if (current !== this.phoneCountry.country) {
            this.$timeout(() => {
              if (this.editAccountForm.onFieldChange) {
                this.editAccountForm.onFieldChange(
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
          value = EditAccountFormFieldController.cleanPhoneNumber(value);
        } else if (this.isGenericIdentifierField()) {
          value = EditAccountFormFieldController.cleanIdentifier(value);
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
        if (this.rule.label === this.FIELD_NAME_LIST.password) {
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


  getDescendantProp(obj, desc) {
      var arr = desc.split(".");
      while(arr.length && (obj = obj[arr.shift()]));
      return obj;
  }

  setDefaultValue() {

    const value = this.getDescendantProp(this.contactInformations, this.rule.label);
    if (this.rule.placeholder && !value) {
      if (this.getFieldType() === 'select') {
        this.value = {
          key: this.rule.placeholder,
          // translated:
          //   this.rule.label === this.FIELD_NAME_LIST.timezone
          //     ? this.rule.defaultValue
          //     : this.$translate.instant(
          //         `signup_enum_${this.rule.label}_${this.rule.defaultValue}`,
          //       ),
        };
        //   if (this.editAccountForm.onFieldChange) {
        //     this.editAccountForm.onFieldChange(
        //       this.rule,
        //       this.value.key,
        //       this.fieldset,
        //     );
        //   }
        // } else {
        //   this.value = this.rule.defaultValue;
        //   if (this.editAccountForm.onFieldChange) {
        //     this.editAccountForm.onFieldChange(
        //       this.rule,
        //       this.value,
        //       this.fieldset,
        //     );
        //   }
        // }
      }
      else {
        this.value = this.rule.placeholder;
      }
    }
  }

  // if rule has an initialValue, use it
  setInitialValue() {
    const initialValue = this.getDescendantProp(this.contactInformations, this.rule.label);
    if (initialValue) {
      let value = angular.copy(initialValue);
      if (this.getFieldType() === 'select') {
        value = {
          key: value,
          // translated:
          //   this.rule.label === this.FIELD_NAME_LIST.timezone
          //     ? value
          //     : this.$translate.instant(
          //       `signup_enum_${
          //         this.rule.label === this.FIELD_NAME_LIST.area
          //           ? `${this.editAccountForm.model.country}_`
          //           : ''
          //       }${this.rule.label}_${value}`,
          //     ),
        };
      }
      // else if (this.getFieldType() === 'date') {
      //   value = moment(this.rule.initialValue, 'YYYY-MM-DD').toDate();
      // }
      // else if (this.rule.prefix && startsWith(value, this.rule.prefix)) {
      //   value = value.slice(this.rule.prefix.length);
      // }
      this.value = value;
    }
  }

  // returns field type depending of current rule
  getFieldType() {
    if (this.rule.type) {
      return this.rule.type;
    }
    if (this.rule.label === this.FIELD_NAME_LIST.phone) {
      return 'radio';
    }
    if (this.rule.in) {
      return 'select';
    }
    if (/email/.test((this.rule.label || '').toLowerCase())) {
      return 'email';
    }
    if ((this.rule.label || '') === this.FIELD_NAME_LIST.birthDay) {
      return 'date';
    }
    if (
      this.rule.label === this.FIELD_NAME_LIST.phone &&
      find(this.editAccountForm.rules, {
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
        this.rule.label === this.FIELD_NAME_LIST.area &&
        this.editAccountForm.model.country
      ) {
        translated = this.$translate.instant(
          `signup_enum_${this.editAccountForm.model.country}_${this.rule.label}_${value}`,
        );
      } else if (this.rule.label === this.FIELD_NAME_LIST.timezone) {
        translated = value;
      } else if (this.rule.label === this.FIELD_NAME_LIST.managerLanguage) {
        translated = get(find(LANGUAGES.available, { key: value }), 'name');
      } else {
        translated = this.$translate.instant(
          `signup_enum_${this.rule.label}_${value}`,
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
      this.rule.label === this.FIELD_NAME_LIST.phoneType,
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
  getLabelTranslation() {
    // 3 cases
    // Void
    // Mandatory
    // Optionnal

    // TODO: handle void case here!
    const mandatory = this.rule.constraints.find(item => item.operator === 'required');
    return this.$translate
      .instant(
        'domain_tab_CONTACT_edit_form_' +
        this.rule.label.split('.').join('_') +
        (!!mandatory ? '' : 'signup_not_mandatory_field') +
        '_label',
      );
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
    ].includes(this.rule.label);
  }

  // true if field is a phone number
  isPhoneNumberField() {
    return ['phone', 'fax'].includes(this.rule.label);
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
      value = EditAccountFormFieldController.cleanPhoneNumber(value);
    } else if (this.isGenericIdentifierField()) {
      value = EditAccountFormFieldController.cleanIdentifier(value);
    }
    if (fieldType === 'select') {
      value = value ? value.key : value;
    } else if (fieldType === 'date') {
      // avoids datepicker setting value to null
      if (!value) {
        this.editAccountForm.onFieldChange(this.rule, undefined, this.fieldset);
        return;
      }
      value = moment(value).format('YYYY-MM-DD');
    } else if (
      this.rule.prefix &&
      value &&
      this.rule.label !== this.FIELD_NAME_LIST.zip
    ) {
      // only add prefix if value is defined
      value = this.rule.prefix + value;
    } else if (fieldType === 'checkbox') {
      value = !value;
    }

    // notify field changes
    if (this.editAccountForm.onFieldChange) {
      this.editAccountForm.onFieldChange(this.rule, value, this.fieldset);
    }

    // if email or ovhCompany changes, we need to check for email availability
    if (
      this.rule.label === this.FIELD_NAME_LIST.email ||
      this.rule.label === this.FIELD_NAME_LIST.ovhCompany
    ) {
      this.$scope.$emit('account.email.request.validity');
    }

    if (isObject(this.rule.tracking)) {
      this.atInternet.trackClick(this.rule.tracking);
    }
  }

  onPhonePrefixChange() {
    this.phonePrefixChanged = true;
    if (this.editAccountForm.onFieldChange) {
      this.editAccountForm.onFieldChange(
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

}
