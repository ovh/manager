import {
  CONTACT_KEY,
  CONTACT_SECTION,
  GENERAL_KEY,
  GENERAL_SECTION,
  PROFILE_KEY,
  PROFILE_SECTION,
  SECTIONS,
} from './edit.constants';

export default class DomainContactEditCtrl {
  /* @ngInject */
  constructor($stateParams, ContactService, $q, Alerter, $translate) {
    this.$stateParams = $stateParams;
    this.contactId = $stateParams.contactId;
    this.domainName = $stateParams.domainName;
    this.contactInformations = $stateParams.contactInformations;
    this.SECTIONS = SECTIONS;
    this.rules = null;
    this.model = this.model || {}; // form model
    this.$q = $q;
    this.ContactService = ContactService;
    this.Alerter = Alerter;
    this.$translate = $translate;
    // forms with its corresponding section
    this.form_part_general = null;
    this.form_part_profile = null;
    this.form_part_contact = null;
  }

  $onInit() {
    this.loading = true;

    // backup of original model
    this.originalModel = angular.copy(this.model);

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
      return;
    }
    const fields = this.SECTIONS[section];
    return this.rules.fields.and.filter(
      (rule) => fields.includes(rule.label) && !rule.readonly,
    );
  }

  // return the list of form fieldsets
  getSections(side = 'left') {
    return side === 'left'
      ?
      [GENERAL_KEY, PROFILE_KEY]
      :
      [CONTACT_KEY];
  }

  submit() {
    // TODO: pre check here

    // TODO/ bind data from form here (see example in legacy)
    this.ContactService
      .putDomainContact(this.contactId)
      .catch(error => this.Alerter.error(
        `${this.$translate.instant('domain_tab_CONTACT_edit_form_error_msg')} ${
          error.message
        }`,
        'InfoErrors',
      ));
  }
}
