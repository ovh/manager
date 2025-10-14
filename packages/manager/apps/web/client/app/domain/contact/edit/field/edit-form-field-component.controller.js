import {
  FIELD_NAME_LIST,
  POINT_SEPARATOR,
  FORM_PART_PREFIX,
  GENERAL_KEY,
  CONTACT_KEY,
  PROFILE_KEY,
  SECTIONS,
  OPERATORS,
  OVH_FIELD_PREFIX,
  REGEX,
  OTHER_KEY,
  FORCED_FIELDS,
} from '../edit.constants';

export default class EditOwnerFormFieldController {
  /* @ngInject */
  constructor($locale, $scope, $translate, atInternet, coreConfig) {
    this.$locale = $locale;
    this.$scope = $scope;
    this.$translate = $translate;
    this.atInternet = atInternet;

    this.FORM_PART_PREFIX = FORM_PART_PREFIX;
    this.POINT_SEPARATOR = POINT_SEPARATOR;
    this.FIELD_NAME_LIST = FIELD_NAME_LIST;
    this.GENERAL_KEY = GENERAL_KEY;
    this.CONTACT_KEY = CONTACT_KEY;
    this.PROFILE_KEY = PROFILE_KEY;
    this.SECTIONS = SECTIONS;

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
  }

  currentForm() {
    const form = this.domainZoneDashboardContactEdit.ovhEditContactForm;
    return {
      ...(form[`${FORM_PART_PREFIX}${GENERAL_KEY}`] &&
        Object.fromEntries(
          Object.entries(form[`${FORM_PART_PREFIX}${GENERAL_KEY}`]).filter(
            ([key]) => {
              return key.includes(OVH_FIELD_PREFIX);
            },
          ),
        )),
      ...(form[`${FORM_PART_PREFIX}${PROFILE_KEY}`] &&
        Object.fromEntries(
          Object.entries(form[`${FORM_PART_PREFIX}${PROFILE_KEY}`]).filter(
            ([key]) => {
              return key.includes(OVH_FIELD_PREFIX);
            },
          ),
        )),
      ...(form[`${FORM_PART_PREFIX}${CONTACT_KEY}`] &&
        Object.fromEntries(
          Object.entries(form[`${FORM_PART_PREFIX}${CONTACT_KEY}`]).filter(
            ([key]) => {
              return key.includes(OVH_FIELD_PREFIX);
            },
          ),
        )),
      ...(form[`${FORM_PART_PREFIX}${OTHER_KEY}`] &&
        Object.fromEntries(
          Object.entries(form[`${FORM_PART_PREFIX}${OTHER_KEY}`]).filter(
            ([key]) => {
              return key.includes(OVH_FIELD_PREFIX);
            },
          ),
        )),
    };
  }

  fieldCurrentValue(fieldName) {
    const value =
      this.currentForm()[`ovh_field_${fieldName}`]?.$modelValue ||
      this.getDescendantProp(this.contactInformations, this.rule.label);
    return typeof value === 'object' ? value.key : value;
  }

  checkStringValue(fieldName, constraintValue, haveToInclude, strict) {
    let check = false;
    if (strict) {
      check = this.fieldCurrentValue(fieldName) === constraintValue;
    } else {
      check = this.fieldCurrentValue(fieldName).includes(constraintValue);
    }
    return haveToInclude ? check : !check;
  }

  checkArrayValue(fieldName, constraintsValues, haveToInclude) {
    const check = constraintsValues.includes(this.fieldCurrentValue(fieldName));
    return haveToInclude ? check : !check;
  }

  checkConstraint(rules) {
    const constraints =
      rules.conditions?.fields.constraints || rules.constraints;
    const fieldLabel = rules.conditions?.fields.label || rules.label;
    const equalRule = {
      field: fieldLabel,
      ...constraints.find((constraint) => constraint.operator === OPERATORS.EQ),
    };
    const noEqualRule = {
      field: fieldLabel,
      ...constraints.find((constraint) => constraint.operator === OPERATORS.NE),
    };
    const containsRule = {
      field: fieldLabel,
      ...constraints.find(
        (constraint) => constraint.operator === OPERATORS.CONTAINS,
      ),
    };
    const notcontainsRule = {
      field: fieldLabel,
      ...constraints.find(
        (constraint) => constraint.operator === OPERATORS.NOTCONTAINS,
      ),
    };

    if (equalRule.operator) {
      return this[equalRule.values ? 'checkArrayValue' : 'checkStringValue'](
        equalRule.field,
        equalRule.value || equalRule.values,
        true,
        true,
      );
    }

    if (noEqualRule.operator) {
      return this[noEqualRule.values ? 'checkArrayValue' : 'checkStringValue'](
        noEqualRule.field,
        noEqualRule.value || noEqualRule.values,
        false,
        true,
      );
    }

    if (containsRule.operator) {
      return this[containsRule.values ? 'checkArrayValue' : 'checkStringValue'](
        containsRule.field,
        containsRule.value || containsRule.values,
        true,
        false,
      );
    }

    if (notcontainsRule.operator) {
      return this[
        notcontainsRule.values ? 'checkArrayValue' : 'checkStringValue'
      ](
        notcontainsRule.field,
        notcontainsRule.value || notcontainsRule.values,
        false,
        false,
      );
    }

    return true;
  }

  // Returns a list of fields that are required to pass the validation rules.
  // In some cases we need to return a list of fields even though the rule says otherwise.
  isRequired() {
    return (
      Object.values(FORCED_FIELDS).includes(this.rule?.label) ||
      !!this.rule?.constraints
        .filter((constraint) => constraint.operator === 'required')
        .find((rules) => {
          if (rules?.conditions) {
            return rules?.conditions?.and
              ? !rules?.conditions?.and
                  .map((rule) => this.checkConstraint(rule.fields))
                  .some((e) => e === false)
              : this.checkConstraint(rules);
          }
          return !!rules;
        })
    );
  }

  isReadOnly() {
    return !!this.rule?.constraints
      .filter((constraint) => constraint.operator === 'readonly')
      .find((rules) => {
        if (rules?.conditions) {
          return rules?.conditions?.and
            ? !rules?.conditions?.and
                .map((rule) => this.checkConstraint(rule.fields))
                .some((e) => e === false) && this.isRequired()
            : this.checkConstraint(rules) && this.isRequired();
        }
        return !!rules && this.isRequired();
      });
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
        const enums = this.getTranslatedEnums();

        if (this.rule.label === this.FIELD_NAME_LIST.language) {
          const languageKey = this.contactInformations.language;
          this.value = enums.find((item) => item.key === languageKey) || null;
          return;
        }

        if (this.rule.label === this.FIELD_NAME_LIST.country) {
          const countryKey = this.contactInformations.country;
          this.value = enums.find((item) => item.key === countryKey) || null;
        }
      }
    }
  }

  // if rule has an initialValue, use it
  setInitialValue() {
    if (!this.rule || !this.contactInformations) return;
    const enums = this.getTranslatedEnums();
    const initialValue = this.getDescendantProp(
      this.contactInformations,
      this.rule.label,
    );

    if (this.getFieldType() === 'select') {
      this.value = enums.find((item) => item.key === initialValue) || null;
    } else if (this.getFieldType() === 'date') {
      this.value = moment(initialValue, 'YYYY-MM-DD').toDate();
    } else {
      this.value = angular.copy(initialValue);
    }
  }

  // returns field type depending of current rule
  getFieldType() {
    if (
      this.rule.constraints.find(
        (constraint) => constraint.operator === 'contains',
      )?.values
    ) {
      return 'select';
    }

    if (this.rule.label === this.FIELD_NAME_LIST.birthDay) {
      return 'date';
    }
    return 'text';
  }

  // returns field type depending of current rule
  getFieldSubType() {
    if ([this.FIELD_NAME_LIST.email].includes(this.rule.label)) {
      return 'email';
    }
    if (
      [this.FIELD_NAME_LIST.phone, this.FIELD_NAME_LIST.cellPhone].includes(
        this.rule.label,
      )
    ) {
      return 'tel';
    }
    return 'text';
  }

  inputValidator() {
    if ([this.FIELD_NAME_LIST.email].includes(this.rule.label)) {
      return REGEX.EMAIL;
    }
    if (
      [this.FIELD_NAME_LIST.phone, this.FIELD_NAME_LIST.cellPhone].includes(
        this.rule.label,
      )
    ) {
      return REGEX.PHONE;
    }
    return null;
  }

  hasReadOnlyField() {
    return (
      Object.values(this.currentForm()).filter((field) => field.$$attr.disabled)
        .length > 0
    );
  }

  getEnumList() {
    return (
      this.rule?.constraints
        .filter((constraint) => constraint.operator === 'contains')
        .find((rules) => {
          if (rules?.conditions) {
            return rules?.conditions?.and
              ? !rules?.conditions?.and
                  .map((rule) => this.checkConstraint(rule.fields))
                  .some((e) => e === false)
              : this.checkConstraint(rules);
          }
          return !!rules;
        })?.values || []
    );
  }

  // returns translated list of rule enum values
  getTranslatedEnums() {
    if (this.translatedEnumCache) {
      return this.translatedEnumCache;
    }

    const result = this.getEnumList()
      .map((value) => {
        const translated = [
          this.FIELD_NAME_LIST.legalform,
          this.FIELD_NAME_LIST.legalFormCategory,
          this.FIELD_NAME_LIST.registrantDocumentType,
        ].includes(this.rule.label)
          ? this.$translate.instant(
              `domain_tab_CONTACT_edit_form_enum_${this.rule.label}_${value}`.replace(
                /\./g,
                '_',
              ),
            )
          : this.$translate.instant(
              `${this.rule.label}_${value}`
                .replace(/\./g, '_')
                .replace(/address_country|nationality/, 'country'),
            );
        return {
          key: value,
          translated,
        };
      })
      .sort((a, b) => a.translated.localeCompare(b.translated));

    this.translatedEnumCache = result;
    return result;
  }

  getLabelTranslation() {
    this.rule.isReadOnly = this.isReadOnly() && this.isRequired();
    const translatedLabel = this.$translate.instant(
      `domain_tab_CONTACT_edit_form_label_${this.rule.label
        .split(this.POINT_SEPARATOR)
        .join('_')}`,
    );

    return [translatedLabel, ...(this.rule.isReadOnly ? ['*'] : [])].join(' ');
  }

  getFormattedTranslation(rule, value) {
    if (
      [
        this.FIELD_NAME_LIST.addressCountry,
        this.FIELD_NAME_LIST.nationality,
      ].includes(rule.label)
    ) {
      return this.$translate.instant(
        `${rule.label}_${value}`
          .replace(/\./g, '_')
          .replace(/address_country|nationality/, 'country'),
      );
    }

    return [
      this.FIELD_NAME_LIST.legalform,
      this.FIELD_NAME_LIST.legalFormCategory,
      this.FIELD_NAME_LIST.registrantDocumentType,
    ].includes(rule.label)
      ? this.$translate.instant(
          `domain_tab_CONTACT_edit_form_enum_${rule.label}_${value}`.replace(
            /\./g,
            '_',
          ),
        )
      : this.$translate.instant(
          `${this.rule.label}_${value}`.replace(/\./g, '_'),
        );
  }

  dateFormat() {
    return this.$locale.DATETIME_FORMATS.shortDate
      .replace('dd', 'd')
      .replace(/MM|M/g, 'm')
      .replace(/yy|y/g, 'Y');
  }
}
