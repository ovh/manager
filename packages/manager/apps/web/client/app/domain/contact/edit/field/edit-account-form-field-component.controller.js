import head from 'lodash/head';
import map from 'lodash/map';
import {
  FIELD_NAME_LIST,
  POINT_SEPARATOR,
  FORM_PART_PREFIX,
  GENERAL_KEY,
  CONTACT_KEY,
  PROFILE_KEY,
  SECTIONS,
  PHONE_PREFIX,
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

    this.FORM_PART_PREFIX = FORM_PART_PREFIX;
    this.POINT_SEPARATOR = POINT_SEPARATOR;
    this.FIELD_NAME_LIST = FIELD_NAME_LIST;
    this.GENERAL_KEY = GENERAL_KEY;
    this.CONTACT_KEY = CONTACT_KEY;
    this.PROFILE_KEY = PROFILE_KEY;
    this.SECTIONS = SECTIONS;
    this.PHONE_PREFIX = PHONE_PREFIX;

    this.user = coreConfig.getUser();
  }

  $onInit() {
    // unique field identifier
    this.id = `ovh_field_${this.rule.label}`;

    // field value
    this.value = undefined;

    // set value
    this.setDefaultValue();

    // initialize value if rule has initialValue attribute
    this.setInitialValue();

    // cache for enum translations
    this.translatedEnumCache = null;

    // validate input on rule update
    this.$scope.$watch('$ctrl.rule', () => {
      this.translatedEnumCache = null;
      if (this.fieldset && this.fieldset[this.id]) {
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

    // handle special phone prefix case
    if (this.getFieldType() === 'phone') {
      this.$scope.$watch(
        '$ctrl.domainZoneDashboardContactEdit.rules',
        (rules) => {
          const rule = rules.fields.and.find(
            (value) => value.label === this.FIELD_NAME_LIST.addressCountry,
          );
          this.phoneCountryList = rule?.constraints
            .find((constraint) => constraint.operator === 'contains')
            .values?.map((country) => ({
              country,
              prefix: PHONE_PREFIX[country],
              label: this.$translate.instant(`country_${country}`),
            }));
          this.phoneCountryList = this.$filter('orderBy')(
            this.phoneCountryList,
            'label',
            false,
            (a, b) => String(a.value).localeCompare(String(b.value)),
          );
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

        if (this.rule.label === this.FIELD_NAME_LIST.email) {
          return new RegExp(/^(?:[\w-.]+@[\w-.]+\.[\w-]+)?$/).test(value);
        }
        if (
          [this.FIELD_NAME_LIST.phone, this.FIELD_NAME_LIST.cellphone].includes(
            this.rule.label,
          )
        ) {
          return new RegExp(/^\d+$/g).test(value);
        }

        const contains = this.rule.constraints.find(
          (constraint) => constraint.operator === 'contains',
        );
        const mandatory = this.rule.constraints.find(
          (constraint) => constraint.operator === 'required',
        );

        if (contains) {
          if (mandatory) {
            return value && contains.values.includes(value.key);
          }
          if (value) {
            return contains.values.includes(value.key);
          }
        }

        return true;
      },
    };
  }

  goToTunnelOrder() {
    window.open(
      `https://www.ovh.com/fr/order/domain/#/legacy/domain/trade/list?options/trade/list?options=${JSURL.stringify(
        [this.domainName],
      )}`,
      '_blank',
    );
  }

  isNotEmpty(constraintToCheck) {
    const notEmptyConstraints =
      constraintToCheck.conditions?.fields?.constraints[0]?.operator ===
      'notempty';
    if (notEmptyConstraints) {
      const fieldNotEmpty = constraintToCheck.conditions?.fields?.label;
      const isDirty = this.fieldset.$dirty;
      if (isDirty) {
        return false;
      }
      return this.rule.label === fieldNotEmpty && this.value;
    }
    return false;
  }

  isRequired() {
    const required = this.rule.constraints.find(
      (constraint) => constraint.operator === 'required',
    );

    const fieldNotEqual = required.conditions?.fields.label;
    const notEqualConstraint =
      required.conditions?.fields.constraints[0]?.operator === 'ne';
    const valueNotEqual = required.conditions?.fields.constraints[0]?.value;

    if (notEqualConstraint) {
      return this.contactInformations[fieldNotEqual] !== valueNotEqual;
    }
    return !!required;
  }

  getDescendantProp(obj, desc) {
    const arr = desc.split(this.POINT_SEPARATOR);
    // eslint-disable-next-line no-param-reassign, no-cond-assign
    while (arr.length && (obj = obj[arr.shift()]));
    return obj;
  }

  setDefaultValue() {
    const value = this.getDescendantProp(
      this.contactInformations,
      this.rule.label,
    );
    if (this.rule.placeholder && !value) {
      if (this.getFieldType() === 'select') {
        this.value = {
          key: this.rule.placeholder,
        };
      } else {
        this.value = this.rule.placeholder;
      }
    }
  }

  // if rule has an initialValue, use it
  setInitialValue() {
    const invertKeyValues = (obj, fn) =>
      Object.keys(obj).reduce((acc, key) => {
        const val = fn ? fn(obj[key]) : obj[key];
        acc[val] = acc[val] || [];
        acc[val].push(key);
        return acc;
      }, {});

    const initialValue = this.getDescendantProp(
      this.contactInformations,
      this.rule.label,
    );
    if (initialValue) {
      let value = angular.copy(initialValue);
      if (
        [this.FIELD_NAME_LIST.phone, this.FIELD_NAME_LIST.cellPhone].includes(
          this.getFieldType(),
        )
      ) {
        [this.rule.phonePrefix, value] = initialValue.split(
          this.POINT_SEPARATOR,
        );
        const country = invertKeyValues(this.PHONE_PREFIX)[
          (this.rule.phonePrefix ?? this.PHONE_PREFIX.FR).replace('+', '')
        ][0];
        this.phoneCountry = { country };
      } else if (this.getFieldType() === 'select') {
        const translated = this.getFormattedTranslation(this.rule, value);
        value = {
          key: value,
          translated,
        };
      } else if (this.getFieldType() === 'date') {
        value = moment(initialValue, 'YYYY-MM-DD').toDate();
      }
      this.value = value;
    }
  }

  getFormattedTranslation(rule, value) {
    if ([this.FIELD_NAME_LIST.addressCountry].includes(rule.label)) {
      return this.$translate.instant(
        `${rule.label}_${value}`
          .replace(/\./g, '_')
          .replace('address_country', 'country'),
      );
    }

    return [this.FIELD_NAME_LIST.legalform].includes(rule.label)
      ? this.$translate.instant(
          `domain_tab_CONTACT_edit_form_${rule.label}_${value}`.replace(
            /\./g,
            '_',
          ),
        )
      : this.$translate.instant(
          `${this.rule.label}_${value}`.replace(/\./g, '_'),
        );
  }

  // returns field type depending of current rule
  getFieldType() {
    if (
      this.rule.constraints.find(
        (constraint) => constraint.operator === 'contains',
      )
    ) {
      if (
        this.rule.constraints.find(
          (constraint) => constraint.operator === 'readonly',
        )
      ) {
        return 'select-readonly';
      }
      return 'select';
    }
    if (/email/.test((this.rule.label || '').toLowerCase())) {
      const maxLength = this.rule.constraints.find(
        (constraint) => constraint.operator === 'maxlength',
      );
      if (maxLength) {
        this.rule.maxLength = maxLength.value;
      }
      if (
        this.rule.constraints.find(
          (constraint) => constraint.operator === 'readonly',
        )
      ) {
        return 'email-readonly';
      }
      return 'email';
    }
    if (this.rule.label === this.FIELD_NAME_LIST.phone) {
      const maxLength = this.rule.constraints.find(
        (constraint) => constraint.operator === 'maxlength',
      );
      if (maxLength) {
        this.rule.maxLength = maxLength.value;
      }
      return 'phone';
    }
    if ((this.rule.label || '') === this.FIELD_NAME_LIST.birthDay) {
      return 'date';
    }
    if (this.rule.type === 'string') {
      const isReadOnly = this.rule.constraints.find(
        (constraint) => constraint.operator === 'readonly',
      );
      if (isReadOnly) {
        return this.isNotEmpty(isReadOnly) ? 'text-readonly' : 'text';
      }
      const maxLength = this.rule.constraints.find(
        (constraint) => constraint.operator === 'maxlength',
      );
      if (maxLength) {
        this.rule.maxLength = maxLength.value;
      }
      return 'text';
    }
    return 'text';
  }

  // returns translated list of rule enum values
  getTranslatedEnums() {
    if (this.translatedEnumCache) {
      return this.translatedEnumCache;
    }

    const containsArray = this.rule.constraints.find(
      (constraint) => constraint.operator === 'contains',
    );

    let result = map(containsArray.values || [], (value) => {
      const translated = [this.FIELD_NAME_LIST.legalform].includes(
        this.rule.label,
      )
        ? this.$translate.instant(
            `domain_tab_CONTACT_edit_form_${this.rule.label}_${value}`.replace(
              /\./g,
              '_',
            ),
          )
        : this.$translate.instant(
            `${this.rule.label}_${value}`
              .replace(/\./g, '_')
              .replace('address_country', 'country'),
          );
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
    this.rule.mandatory = this.isRequired();
    const mandatoryLabel = this.rule.mandatory ? 'mandatory' : 'optionnal';

    const translatedLabel = this.$translate
      .instant(
        `domain_tab_CONTACT_edit_form_${this.rule.label
          .split(this.POINT_SEPARATOR)
          .join('_')}_label`,
      )
      .replace('address_country', 'country');

    return [
      translatedLabel,
      this.$translate.instant(`domain_tab_CONTACT_edit_form_${mandatoryLabel}`),
    ].join(' ');
  }

  // true if current modified field is valid, false otherwise
  isValid() {
    const field = this.getField();
    return this.value && field && field.$valid;
  }

  // true if current field is dirty and invalid
  isInvalid() {
    const field = this.getField();
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
    return ['phone', 'cellPhone', 'fax'].includes(this.rule.label);
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
        this.domainZoneDashboardContactEdit.onFieldChange(
          this.rule,
          undefined,
          this.fieldset,
        );
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
    if (this.domainZoneDashboardContactEdit.onFieldChange) {
      this.domainZoneDashboardContactEdit.onFieldChange(
        this.rule,
        value,
        this.fieldset,
      );
    }

    // if email or ovhCompany changes, we need to check for email availability
    if (
      this.rule.label === this.FIELD_NAME_LIST.email ||
      this.rule.label === this.FIELD_NAME_LIST.ovhCompany
    ) {
      this.$scope.$emit('account.email.request.validity');
    }
  }

  onPhonePrefixChange() {
    this.phonePrefixChanged = true;
    if (this.domainZoneDashboardContactEdit.onFieldChange) {
      this.domainZoneDashboardContactEdit.onFieldChange(
        {
          fieldName: this.FIELD_NAME_LIST.phone,
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

  getField() {
    const formPartGeneral = this.domainZoneDashboardContactEdit[
      this.FORM_PART_PREFIX + this.GENERAL_KEY
    ];
    const formPartContact = this.domainZoneDashboardContactEdit[
      this.FORM_PART_PREFIX + this.CONTACT_KEY
    ];
    const formPartProfile = this.domainZoneDashboardContactEdit[
      this.FORM_PART_PREFIX + this.PROFILE_KEY
    ];

    if (formPartGeneral && this.SECTIONS[this.GENERAL_KEY].includes(this.id)) {
      return formPartGeneral[this.id];
    }

    if (formPartContact && this.SECTIONS[this.CONTACT_KEY].includes(this.id)) {
      return formPartContact[this.id];
    }

    if (formPartProfile) {
      return formPartProfile[this.id];
    }

    return null;
  }
}
