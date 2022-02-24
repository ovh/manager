import angular from 'angular';

// lodash imports
import find from 'lodash/find';
import get from 'lodash/get';
import keyBy from 'lodash/keyBy';
import keys from 'lodash/keys';
import map from 'lodash/map';
import set from 'lodash/set';
import snakeCase from 'lodash/snakeCase';

import OvhContact from './helpers/ovh-contact.class';
import OvhContactsHelper from './helpers/ovh-contacts.helpers';

import {
  ENUMS_TO_TRANSFORM,
  GET_LIST_DEFAULT_OPTIONS,
} from './ovh-contacts.constants';

let connectedNic;
let meSchemas;

export default class OvhContactsService {
  // @see /src/ovh-contacts.provider.js for dependency injections
  constructor($q, $translate, OvhApiMe, OvhApiNewAccount, target, iceberg) {
    this.$q = $q;
    this.$translate = $translate;
    this.OvhApiMe = OvhApiMe;
    this.OvhApiNewAccount = OvhApiNewAccount;
    this.target = target;
    this.iceberg = iceberg;
  }

  /**
   *  Convert a nic to a contact.
   *  @param  {Object} nicToConvert The nic that needs to be converted to contact.
   *                                If none provided, it will transform the current connected nic.
   *  @return {Promise} That returns an Object representing a contact.
   */
  convertNicToContact(nicToConvert = null) {
    return this.$q
      .all({
        nic: nicToConvert ? this.$q.when(nicToConvert) : this.getConnectedNic(),
        apiSchemas: this.getMeSchemas(),
      })
      .then(({ nic, apiSchemas }) => {
        const contactProperties = OvhContactsHelper.mergeContactEnumsProperties(
          get(apiSchemas, 'models["contact.Contact"].properties'),
          get(apiSchemas, 'models["contact.Address"].properties'),
        );

        const nicToContact = new OvhContact(
          OvhContactsHelper.convertNicToContact(nic, contactProperties),
        );

        return nicToContact;
      });
  }

  /**
   *  POST a new contact to API.
   *  @param  {Object} contact The options for creating the new contact.
   *  @return {Promise}        That returns an instance of OvhContact with new contact
   *                           informations.
   */
  createContact(contactParam) {
    const contact = contactParam;

    return this.OvhApiMe.Contact()
      .v6()
      .create({}, contact)
      .$promise.then(({ id }) => {
        contact.id = id;
        return new OvhContact(contact);
      });
  }

  /**
   *  Get the informations of the connected user (nic).
   *  @return {Promise} That returns an Object with connected nic informations.
   */
  getConnectedNic() {
    if (connectedNic) {
      return this.$q.when(connectedNic);
    }

    return this.OvhApiMe.v6()
      .get()
      .$promise.then((nic) => {
        connectedNic = nic;
        return nic;
      });
  }

  /**
   *  Get the contacts list of connected user.
   *  @param  {Object}    options                 Options for fetching contacts
   *  @param  {Boolean}   options.avoidDuplicates Flag that will filter contacts that are the same
   *  @param  {Function}  options.customFilter    A function that when called will filter the list
   *                                              of contacts.
   *                                              Must return an Array of contacts filtered.
   *  @return {Promise} That returns an Array of contacts objects.
   */
  getContacts(options = GET_LIST_DEFAULT_OPTIONS) {
    let promise;

    if (this.target === 'EU') {
      promise = this.iceberg('/me/contact')
        .query()
        .expand('CachedObjectList-Pages')
        .execute()
        .$promise.then(({ data: contacts }) => contacts.filter(Boolean));
    } else {
      promise = this.OvhApiMe.Contact()
        .v6()
        .query()
        .$promise.then((contactIds) =>
          this.$q.all(
            map(contactIds, (contactId) => {
              const contactPromise = this.OvhApiMe.Contact()
                .v6()
                .get({
                  contactId,
                });
              return contactPromise.$promise;
            }),
          ),
        );
    }

    return promise.then((contactsList) => {
      let contacts = contactsList;

      if (options.avoidDuplicates) {
        contacts = OvhContactsHelper.filterSimilarContacts(contacts);
      }
      if (options.customFilter && angular.isFunction(options.customFilter)) {
        contacts = options.customFilter(contacts);
      }

      return map(contacts, (contactOptions) => new OvhContact(contactOptions));
    });
  }

  /**
   *  Get creation rules by using /newAccount/rules API.
   *  Merge the contact schemas with /newAccount/rules response.
   *  @param  {Object} rulesOpts Arguments that will be posted to /newAccount/rules call
   *  @return {Promise}          That returns a list of creation rules.
   */
  getCreationRules(rulesOpts = {}, predefinedProperties = null) {
    const options = rulesOpts;

    return this.getConnectedNic()
      .then((me) => {
        set(options, 'ovhCompany', me.ovhCompany);
        set(options, 'ovhSubsidiary', me.ovhSubsidiary);
        set(options, 'country', options.country || me.country);
        set(
          options,
          'phoneCountry',
          options.phoneCountry || options.country || me.country,
        );

        return options;
      })
      .then((rulesOptions) =>
        this.$q.all({
          apiSchemas: this.getMeSchemas(),
          creationRules: this.OvhApiNewAccount.v6().rules({}, rulesOptions)
            .$promise,
        }),
      )
      .then(({ apiSchemas, creationRules }) => {
        const rules = OvhContactsHelper.mergeContactPropertiesWithCreationRules(
          apiSchemas,
          keyBy(creationRules, 'fieldName'),
          predefinedProperties,
          options,
        );

        // translate properties with enum
        // first get rules with enum
        const getRulesWithEnum = (rulesParam, result = []) => {
          keys(rulesParam).forEach((ruleKey) => {
            if (ruleKey === 'address') {
              getRulesWithEnum(rulesParam.address, result);
            } else if (get(rulesParam, `${ruleKey}.enum`)) {
              result.push(get(rulesParam, ruleKey));
            }
          });

          return result;
        };

        getRulesWithEnum(rules).forEach((ruleParam) => {
          const rule = ruleParam;

          rule.enum = map(rule.enum, (enumVal) => {
            let translationKey = `ovh_contact_form_${snakeCase(
              rule.fullType,
            )}_${enumVal}`;
            const enumExtra = find(ENUMS_TO_TRANSFORM, { path: rule.name });

            if (enumExtra && enumExtra.dependsOfCountry) {
              translationKey = `ovh_contact_form_${snakeCase(
                rule.fullType !== 'string' ? rule.fullType : rule.name,
              )}_${options.country}_${enumVal}`;
            }

            return {
              value: enumVal,
              label: this.$translate.instant(translationKey),
            };
          });
        });

        return rules;
      });
  }

  /**
   *  Get the /me API schema.
   *  @return {Promise} That returns an object representing the /me API schema.
   */
  getMeSchemas() {
    if (meSchemas) {
      return this.$q.when(meSchemas);
    }

    return this.OvhApiMe.v6()
      .schema()
      .$promise.then((schemas) => {
        meSchemas = schemas;
        return schemas;
      });
  }

  /**
   *  Try to find the most resembling contact to the given nic.
   *  If none have been found, return a contact created from nic information.
   *
   *  @param  {Object} fromNic     The nic to find in list.
   *                               If none provided, will search for the connected user.
   *  @param  {Array}  contactList A contact list to search into.
   *                               If none provided, will fetch all existing contact from API.
   *
   *  @return {Promise}            That returns an Object representing the most ressembling contact
   *                               of given nic.
   */
  findMatchingContactFromNic(fromNic = null, contactList = null) {
    return this.$q
      .all({
        nic: fromNic ? this.$q.when(fromNic) : this.getConnectedNic(),
        contacts: contactList ? this.$q.when(contactList) : this.getContacts(),
      })
      .then(({ nic, contacts }) => {
        const converPromise = this.convertNicToContact(nic);
        return converPromise.then((nicToContact) =>
          OvhContactsHelper.findMatchingContactFromNic(nicToContact, contacts),
        );
      });
  }
}
