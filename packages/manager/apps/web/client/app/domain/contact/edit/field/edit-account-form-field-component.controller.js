import head from 'lodash/head';
import map from 'lodash/map';
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
            .find(constraint => constraint.operator === 'contains')
            .values
            ?.map((country) => ({
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

          const current = this.phoneCountryList.find(
            (value) => value.country === this.domainZoneDashboardContactEdit.model.phoneCountry,
          );
          const orig = this.phoneCountryList.find(
            (value) =>
              value.country === this.domainZoneDashboardContactEdit.originalModel.phoneCountry,
          );
          const country = this.phoneCountryList.find(
            (value) => value.country === this.domainZoneDashboardContactEdit.model.country,
          );
          const subCountry = this.phoneCountryList.find(
            (value) =>
              value.country === this.domainZoneDashboardContactEdit.model.ovhSubsidiary,
          );

          this.phoneCountry =
            current ||
            orig ||
            country ||
            subCountry ||
            head(this.phoneCountryList);

          if (current && current !== this.phoneCountry.country) {
            this.$timeout(() => {
              if (this.domainZoneDashboardContactEdit.onFieldChange) {
                this.domainZoneDashboardContactEdit.onFieldChange(
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

        if (this.rule.label === this.FIELD_NAME_LIST.email) {
          return new RegExp(/^(?:[\w-.]+@[\w-.]+\.[\w-]+)?$/).test(value);
        }

        const contains = this.rule.constraints.find(constraint => constraint.operator === 'contains');
        const mandatory = this.rule.constraints.find(constraint => constraint.operator === 'required');

        if (!!contains) {
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

  getDescendantProp(obj, desc) {
    var arr = desc.split('.');
    while (arr.length && (obj = obj[arr.shift()])) ;
    return obj;
  }

  setDefaultValue() {

    const value = this.getDescendantProp(this.contactInformations, this.rule.label);
    if (this.rule.placeholder && !value) {
      if (this.getFieldType() === 'select') {
        this.value = {
          key: this.rule.placeholder,
        };
        //   if (this.domainZoneDashboardContactEdit.onFieldChange) {
        //     this.domainZoneDashboardContactEdit.onFieldChange(
        //       this.rule,
        //       this.value.key,
        //       this.fieldset,
        //     );
        //   }
        // } else {
        //   this.value = this.rule.defaultValue;
        //   if (this.domainZoneDashboardContactEdit.onFieldChange) {
        //     this.domainZoneDashboardContactEdit.onFieldChange(
        //       this.rule,
        //       this.value,
        //       this.fieldset,
        //     );
        //   }
        // }
      } else {
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
        const formattedTranslation = this.getFormattedTranslation(this.rule, value);
        value = {
          key: value,
          translated: formattedTranslation,
        };
      } else if (this.getFieldType() === 'date') {
        value = moment(initialValue, 'YYYY-MM-DD').toDate();
      }
      this.value = value;
    }
  }


  getFormattedTranslation(rule, value) {
    if ([this.FIELD_NAME_LIST.addressCountry].includes(rule.label)) {
      return this.$translate.instant((
        `${rule.label}_${value}`)
        .replace(/\./g, '_')
        .replace('address_country', 'country'),
      );
    }

    return [this.FIELD_NAME_LIST.legalform].includes(rule.label)
      ? this.$translate.instant((
        `domain_tab_CONTACT_edit_form_${rule.label}_${value}`).replace(/\./g, '_'),
      )
      : this.$translate.instant((
        `${this.rule.label}_${value}`).replace(/\./g, '_'),
      );
  }


  // returns field type depending of current rule
  getFieldType() {
    if (!!this.rule.constraints.find(constraint => constraint.operator === 'contains')) {
      return 'select';
    }
    if (/email/.test((this.rule.label || '').toLowerCase())) {
      const maxLength = this.rule.constraints.find(constraint => constraint.operator === 'maxlength');
      if (!!maxLength) {
        this.rule.maxLength = maxLength.value;
      }
      return 'email';
    }
    if (this.rule.label === this.FIELD_NAME_LIST.phone) {
      const maxLength = this.rule.constraints.find(constraint => constraint.operator === 'maxlength');
      if (!!maxLength) {
        this.rule.maxLength = maxLength.value;
      }
      return 'phone';
    }
    if ((this.rule.label || '') === this.FIELD_NAME_LIST.birthDay) {
      return 'date';
    }
    if (this.rule.type === 'string') {
      if (!!this.rule.constraints.find(constraint => constraint.operator === 'readonly')) {
        return 'text-readonly';
      }
      const maxLength = this.rule.constraints.find(constraint => constraint.operator === 'maxlength');
      if (!!maxLength) {
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

    const containsArray = this.rule
      .constraints
      .find(constraint => constraint.operator === 'contains');

    let result = map(containsArray.values || [], (value) => {
      const translated =
        [this.FIELD_NAME_LIST.legalform].includes(this.rule.label) ?
          this.$translate.instant(
            (`domain_tab_CONTACT_edit_form_${this.rule.label}_${value}`
              .replace(/\./g, '_')),
          )
          :
          this.$translate.instant(
            (`${this.rule.label}_${value}`
              .replace(/\./g, '_'))
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
    // 3 cases
    // Void
    // Mandatory
    // Optionnal

    // TODO: handle void case here!
    const mandatory = this.rule.constraints.find(item => item.operator === 'required');
    this.rule.mandatory = mandatory;
    return this.$translate
      .instant(
        'domain_tab_CONTACT_edit_form_' +
        this.rule.label.split('.').join('_') +
        (!!mandatory ? '' : 'signup_not_mandatory_field') +
        '_label',
      )
      .replace('address_country', 'country');
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
        this.domainZoneDashboardContactEdit.onFieldChange(this.rule, undefined, this.fieldset);
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
      this.domainZoneDashboardContactEdit.onFieldChange(this.rule, value, this.fieldset);
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


  // TODO: refacto: remove domainZoneDashboardContactEdit
  // TODO: pass fieldset directly from top component?!
  getField() {
    const {
      form_part_general,
      form_part_contact,
      form_part_profile,
    } = this.domainZoneDashboardContactEdit;
    if (form_part_general && [
      'firstName',
      'legalForm',
      'organisationName',
      'vat',
    ].includes(this.id)) {
      return form_part_general[this.id];
    }

    if (form_part_contact && ['city', 'country', 'line', 'email', 'phone'].includes(this.id)) {
      return form_part_contact[this.id];
    }
    if (form_part_profile) {
      return form_part_profile[this.id];
    }
  }

  _pickAdditionalRulesFromConstraints(constraint) {
    const additionalRules = {};

    if (_.get(constraint, "operator") === this.REQUIRED) {
      additionalRules.canBeNull = false;
    }

    if (_.get(constraint, "operator") === this.READ_ONLY) {
      additionalRules.readOnly = true;
    }

    if (_.get(constraint, "operator") === this.MAX_LENGTH) {
      additionalRules.maxLength = parseInt(constraint.value, 10) || null;
    }

    if (_.get(constraint, "operator") === this.STRICT_EQUAL &&
      _.has(constraint, "value")) {
      additionalRules.value = _.cloneDeep(constraint.value);
    }

    if (_.get(constraint, "operator") === this.CONTAINS &&
      !_.isEmpty(_.get(constraint, "values"))) {
      additionalRules.values = _.cloneDeep(constraint.values);
      additionalRules.canBeNull = false;
    }

    return additionalRules;
  }
}
