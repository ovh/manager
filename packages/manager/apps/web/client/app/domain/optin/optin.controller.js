import { CONTACTS_TYPES } from './constants';

export default class DomainOptinCtrl {
  /* @ngInject */
  constructor(
    $q,
    $state,
    $stateParams,
    $translate,
    Alerter,
    Domain,
    OvhApiDomainConfigurationsOptin,
    OvhApiDomainRulesOptin,
    DOMAIN,
  ) {
    this.$q = $q;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.Domain = Domain;
    this.OvhApiDomainConfigurationsOptin = OvhApiDomainConfigurationsOptin;
    this.OvhApiDomainRulesOptin = OvhApiDomainRulesOptin;
    this.DOMAIN = DOMAIN;
  }

  $onInit() {
    this.domain = this.$stateParams.productId;
    this.contactTypes = [];
    this.configuration = {};
    this.rules = [];
    this.options = {};
    this.loading = true;

    return this.$q
      .all([this.getContactFields(), this.getOptinRules()])
      .then(() => this.getCurrentConfiguration())
      .catch(() => {
        this.Alerter.error(
          this.$translate.instant('domain_optin_init_error'),
          this.DOMAIN.ALERTS.tabs,
        );
      })
      .finally(() => {
        this.loading = false;
      });
  }

  getOptinRules() {
    return this.OvhApiDomainRulesOptin.v6()
      .query({
        serviceName: this.domain,
      })
      .$promise.then((optinRules) => {
        const contactTypes =
          optinRules.length === CONTACTS_TYPES.length
            ? CONTACTS_TYPES
            : optinRules.map((optinRule) => optinRule.type);
        this.rules = contactTypes.map((contactType) => ({
          type: contactType,
          fields: DomainOptinCtrl.filterIndividualFields(
            optinRules.find(({ type }) => type === contactType).fields,
          ),
        }));
        this.rules.forEach(({ type, fields }) => {
          this.configuration[type] = {
            ...DomainOptinCtrl.mapFields(fields),
            email: false,
          };
          this.options[type] = {
            allFieldsOption: false,
            canEditIndividually: Object.keys(fields).length > 0,
            areFieldsEditedIndividually: false,
          };
        });
      });
  }

  getCurrentConfiguration() {
    return this.OvhApiDomainConfigurationsOptin.v6()
      .query({
        serviceName: this.domain,
      })
      .$promise.then((optinConfigurations) => {
        optinConfigurations.forEach(({ type, fields }) => {
          const fieldsWithoutEmail = fields.filter(
            (field) => field !== 'email',
          );
          this.options[type].allFieldsOption =
            fieldsWithoutEmail.length === this.fields.length;
          this.options[type].areFieldsEditedIndividually =
            !this.options[type].allFieldsOption &&
            fieldsWithoutEmail.length > 0;

          fields.forEach((field) => {
            this.configuration[type][field] = true;
          });
        });
      });
  }

  getContactFields() {
    return this.Domain.getDomainModels().then(({ models }) => {
      this.fields = models['domain.OptinFieldsEnum'].enum.filter(
        (field) => field !== 'email',
      );
    });
  }

  saveOptinConfiguration() {
    const optin = Object.entries(this.configuration)
      .map(([type, fields]) => {
        return {
          type: DomainOptinCtrl.formatContactType(type),
          fields: this.getContactTypeFields(type, fields),
        };
      })
      .filter((data) => data.fields.length > 0);
    return this.OvhApiDomainConfigurationsOptin.v6()
      .put(
        {
          serviceName: this.domain,
        },
        {
          optin,
        },
      )
      .$promise.then(() => {
        this.Alerter.success(
          this.$translate.instant('domain_optin_save_success'),
          this.DOMAIN.ALERTS.tabs,
        );
        return this.$state.go('^.information', this.$stateParams);
      })
      .catch(() => {
        this.Alerter.error(
          this.$translate.instant('domain_optin_save_error'),
          this.DOMAIN.ALERTS.tabs,
        );
      });
  }

  getContactTypeFields(contactType, fields) {
    if (this.options[contactType].areFieldsEditedIndividually) {
      return Object.keys(fields).filter((key) => fields[key] === true);
    }

    const optinFields = fields.email ? ['email'] : [];
    if (this.options[contactType].allFieldsOption) {
      optinFields.push(...Object.keys(fields));
    }
    return optinFields;
  }

  static filterIndividualFields(fields) {
    return fields.filter((field) => field !== 'email');
  }

  static mapFields(fields) {
    return fields.reduce(
      (mappedFields, field) => ({
        ...mappedFields,
        [field]: false,
      }),
      {},
    );
  }

  static formatContactType(contactType) {
    return contactType === 'domain' ? 'all' : contactType;
  }
}
