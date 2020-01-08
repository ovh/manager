import clone from 'lodash/clone';
import get from 'lodash/get';
import indexOf from 'lodash/indexOf';
import reduce from 'lodash/reduce';
import remove from 'lodash/remove';
import sortBy from 'lodash/sortBy';

import { CONTACTS_TYPES } from '../optin/constants';
import { EXCLUDED_CONTACTS } from './email-obfuscation.constant';

export default class DomainEmailObfuscationCtrl {
  /* @ngInject */
  constructor($state, $stateParams, $translate, Alerter, OvhApiDomain, DOMAIN) {
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.OvhApiDomain = OvhApiDomain;
    this.DOMAIN = DOMAIN;
  }

  $onInit() {
    this.domain = this.$stateParams.productId;
    this.loading = {
      contacts: true,
    };
    this.model = {};
    this.configuration = {};
    this.contactsToRegenerate = [];

    return this.getObfuscationRules()
      .then(() => this.getObfuscationConfiguration())
      .catch(() => {
        this.Alerter.error(
          'domain_email_obfuscation_error',
          this.DOMAIN.ALERTS.tabs,
        );
      })
      .finally(() => {
        this.loading.contacts = false;
      });
  }

  getObfuscationRules() {
    return this.OvhApiDomain.Rules()
      .EmailsObfuscation()
      .v6()
      .query({
        serviceName: this.domain,
      })
      .$promise.then((contactTypes) => {
        this.contactTypes = sortBy(
          contactTypes.filter(
            (contact) => !EXCLUDED_CONTACTS.includes(contact),
          ),
          (contact) => indexOf(CONTACTS_TYPES, contact),
        );
        return contactTypes;
      });
  }

  getObfuscationConfiguration() {
    return this.OvhApiDomain.Configurations()
      .ObfuscatedEmails()
      .v6()
      .query({
        serviceName: this.domain,
      })
      .$promise.then((configuration) => {
        this.configuration = this.contactTypes.reduce(
          (previousConfiguration, contact) => ({
            ...previousConfiguration,
            [contact]: configuration.some(({ type }) => type === contact),
          }),
          {},
        );
        this.model = clone(this.configuration);
      });
  }

  updateRegeneration(regenerate, contact) {
    if (regenerate) {
      this.contactsToRegenerate.push(contact);
    } else {
      this.contactsToRegenerate = remove(this.contactsToRegenerate, contact);
    }
  }

  regenerateEmails() {
    this.loading.contacts = true;

    const contactToObfuscate = reduce(
      this.model,
      (contacts, obfuscate, contactType) => {
        if (obfuscate) {
          return [...contacts, contactType];
        }

        return contacts;
      },
      [],
    );
    return this.OvhApiDomain.Configurations()
      .ObfuscatedEmails()
      .v6()
      .put(
        {
          serviceName: this.domain,
        },
        {
          contacts: contactToObfuscate,
        },
      )
      .$promise.then(
        () =>
          this.OvhApiDomain.Configurations()
            .ObfuscatedEmails()
            .v6()
            .refresh(
              {
                serviceName: this.domain,
              },
              {
                contacts: this.contactsToRegenerate.filter((contact) =>
                  contactToObfuscate.includes(contact),
                ),
              },
            ).$promise,
      )
      .then(() => {
        this.Alerter.success(
          this.$translate.instant('domain_email_obfuscation_refresh_success'),
          this.DOMAIN.ALERTS.tabs,
        );
        return this.$state.go('^.information', this.$stateParams);
      })
      .catch((error) => {
        this.Alerter.error(
          this.$translate.instant('domain_email_obfuscation_refresh_error', {
            message: get(error, 'message', ''),
          }),
          this.DOMAIN.ALERTS.tabs,
        );
      })
      .finally(() => {
        this.loading.contacts = false;
      });
  }
}
