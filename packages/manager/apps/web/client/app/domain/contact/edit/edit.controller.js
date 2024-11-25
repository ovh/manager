import {
  FORM_PART_PREFIX,
  OVH_FIELD_PREFIX,
  PHONE_PREFIX,
  FIELD_NAME_LIST,
  GENERAL_KEY,
  PROFILE_KEY,
  CONTACT_KEY,
  SECTIONS,
  POINT_SEPARATOR,
} from './edit.constants';

export default class DomainContactEditCtrl {
  /* @ngInject */
  constructor($stateParams, ContactService, Alerter, $translate) {
    this.$stateParams = $stateParams;
    this.contactId = $stateParams.contactId;
    this.domainName = $stateParams.domainName;
    this.contactInformations = $stateParams.contactInformations;

    this.SECTIONS = SECTIONS;
    this.OVH_FIELD_PREFIX = OVH_FIELD_PREFIX;
    this.POINT_SEPARATOR = POINT_SEPARATOR;
    this.PHONE_PREFIX = PHONE_PREFIX;
    this.FORM_PART_PREFIX = FORM_PART_PREFIX;
    this.FIELD_NAME_LIST = FIELD_NAME_LIST;
    this.CONTACT_KEY = CONTACT_KEY;
    this.GENERAL_KEY = GENERAL_KEY;
    this.PROFILE_KEY = PROFILE_KEY;

    this.rules = null;
    this.ContactService = ContactService;
    this.Alerter = Alerter;
    this.$translate = $translate;
  }

  $onInit() {
    this.loading = true;

    return this.ContactService.getDomainConfigurationRule(
      'update',
      this.$stateParams.domainName,
    )
      .then((rules) => {
        this.rules = rules;
      })
      .catch((err) => {
        this.initError = err.data?.message || err.message || err;
      })
      .finally(() => {
        this.loading = false;
      });
  }

  // return the list of fields for a given fieldset name
  // readonly rules are not returned because they are not editable
  getRulesBySection(section) {
    if (!this.rules) {
      return null;
    }
    const fields = this.SECTIONS[section];
    return this.rules.fields.and.filter(
      (rule) => fields.includes(rule.label) && !rule.readonly,
    );
  }

  // return the list of form fieldsets
  getSections(side = 'left') {
    return side === 'left'
      ? [this.GENERAL_KEY, this.PROFILE_KEY]
      : [this.CONTACT_KEY];
  }

  submit() {
    const data = {
      owner: {
        address: {},
      },
    };

    [this.CONTACT_KEY, this.GENERAL_KEY, this.PROFILE_KEY].forEach(
      (keySection) => {
        const formPartProfileKey = `form_part_${keySection}`;
        const contactFormSection = this.ovhEditContactForm[formPartProfileKey];

        const keys = Object.keys(contactFormSection).filter((key) =>
          key.includes(this.OVH_FIELD_PREFIX),
        );
        keys.reduce((acc, key) => {
          const value = this.ovhEditContactForm[
            this.FORM_PART_PREFIX + keySection
          ][key];
          let phonePrefix = '';

          if (key === this.OVH_FIELD_PREFIX + this.FIELD_NAME_LIST.phone) {
            phonePrefix =
              this.rules.fields.and.find(
                (field) => field.label === this.FIELD_NAME_LIST.phone,
              ).phonePrefix ?? this.PHONE_PREFIX.FR;
            phonePrefix += this.POINT_SEPARATOR;
          }

          if (!value) {
            return acc;
          }

          const hasKey =
            typeof value?.$modelValue === 'object' &&
            Object.keys(value?.$modelValue).includes('key');

          const valueToSend =
            phonePrefix + (hasKey ? value.$modelValue.key : value.$modelValue);
          const hasDot = key.includes('.');
          if (!hasDot) {
            acc.owner[key.split(this.OVH_FIELD_PREFIX)[1]] = valueToSend;
            return acc;
          }

          const props = key.split('.');
          const prefix = props[0].split(this.OVH_FIELD_PREFIX)[1];
          if (!acc.owner[prefix]) {
            acc.owner[prefix] = {};
          }
          acc.owner[prefix][props[1]] = valueToSend;
          return acc;
        }, data);
      },
    );

    this.ContactService.postDomainConfigurationRuleCheck(
      'update',
      this.$stateParams.domainName,
      data,
    )
      .then(() => {
        return this.ContactService.putDomainContact(this.contactId, data.owner);
      })
      .then(() => {
        this.Alerter.success(
          this.$translate.instant('domain_tab_CONTACT_edit_form_success_msg'),
          'InfoErrors',
        );
      })
      .catch((error) => {
        const detailsKeys = Object.keys(error.data.details).filter((item) =>
          item.includes('owner'),
        );
        this.Alerter.error(
          `${this.$translate.instant(
            'domain_tab_CONTACT_edit_form_error_msg',
          )} ${
            error.data.message + error.data.details
              ? detailsKeys
                  .map((detailKey) => error.data.details[detailKey])
                  .join(', ')
              : ''
          }`,
          'InfoErrors',
        );
      });
  }
}
