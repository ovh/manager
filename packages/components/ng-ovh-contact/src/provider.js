import angular from 'angular';
import { forEach, has, keys, set, snakeCase } from 'lodash-es';

export default function() {
  const self = this;

  self.$get = /* @ngInject */ function $get(
    $q,
    $translate,
    OvhContact,
    OvhApiMe,
    CONTACT_EMAIL_REGEX,
    iceberg,
  ) {
    /**
     *  @ngdoc service
     *  @name ovhContact.service:ovhContact
     *
     *  @requires $q
     *  @requires $translate
     *  @requires OvhContact
     *  @requires OvhApiMe
     *
     *  @description
     *  The `ovhContact` service is the actual core of ovhContact module.
     *  This service manage the contacts of the connected user.
     */

    const ovhContactService = {};
    let contacts = [];
    let schemas = null;

    /**
     *  @private
     *  Get /me ovh api schema. Call GET /me.json.
     */
    function getApiSchemas() {
      if (!schemas) {
        return OvhApiMe.v6()
          .schema()
          .$promise.then((apiSchemas) => {
            schemas = apiSchemas;
            return schemas;
          });
      }
      return $q.when(schemas);
    }

    /**
     *  @private
     *  Convert nic address inforamtions to set contact.address informations.
     */
    function convertNicAddressToContactAddress(nic) {
      // keys are the contact address fields names / values are nic fields names
      const addressMapping = {
        line1: 'address',
      };
      const contactAddress = {};

      forEach(schemas.models['contact.Address'].properties, (value, key) => {
        if (has(addressMapping, key) && has(nic, addressMapping[key])) {
          contactAddress[key] = nic[addressMapping[key]];
        } else if (has(nic, key)) {
          contactAddress[key] = nic[key];
        } else {
          contactAddress[key] = null;
        }
      });

      return contactAddress;
    }

    /**
     *  @private
     *  Convert a nic to contact.
     */
    function convertNicToContact(nic) {
      // keys are the contact fields names / values are nic fields names
      const fieldMapping = {
        organisationName: 'organisation',
        lastName: 'name',
        gender: 'sex',
      };
      const contact = {};

      // iterate into contact model to set nic infos
      angular.forEach(
        keys(schemas.models['contact.Contact'].properties),
        (key) => {
          if (key === 'address') {
            contact.address = convertNicAddressToContactAddress(nic);
          } else if (key === 'birthDay') {
            if (new RegExp(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/).test(nic[key])) {
              const splittedDate = nic[key].split('/');
              contact[key] = splittedDate.reverse().join('-');
            } else {
              contact[key] = null;
            }
          } else if (
            fieldMapping[key] &&
            (has(nic, fieldMapping[key]) ||
              has(nic, fieldMapping[key.toLowerCase()]))
          ) {
            contact[key] =
              nic[fieldMapping[key]] ||
              nic[fieldMapping[key.toLowerCase()]] ||
              null;
          } else if (has(nic, key) || has(nic, key.toLowerCase())) {
            contact[key] = nic[key] || nic[key.toLowerCase()] || null;
          } else {
            contact[key] = null;
          }
        },
      );

      return contact;
    }

    /* ----------  CONTACT LIST MANAGEMENT  ----------*/

    /**
     *  @ngdoc method
     *  @name ovhContact.service:ovhContact#addContact
     *  @methodOf ovhContact.service:ovhContact
     *
     *  @description
     *  Add a contact into contacts list.
     *
     *  @param {Object|OvhContact} contactOptions An object with options
     *  or an instance of OvhContact.
     *
     *  @return {OvhContact} The added contact.
     */
    ovhContactService.addContact = function addContact(contactOptions) {
      const addedContact =
        contactOptions instanceof OvhContact
          ? contactOptions
          : new OvhContact(contactOptions);
      contacts.push(addedContact);
      return addedContact;
    };

    /**
     *  @ngdoc method
     *  @name ovhContact.service:ovhContact#getContactList
     *  @methodOf ovhContact.service:ovhContact
     *
     *  @description
     *  Get the entire list of contacts. This use api v7 to get all contacts details.
     *
     *  @param {Boolean} refresh Flag telling to fully recreate the contact list.
     *
     *  @return {Promise} That return an Array of OvhContact.
     */
    ovhContactService.getContactList = function getContactList(refresh) {
      const selff = this;

      if (refresh) {
        contacts = [];
      }

      return iceberg('/me/contact')
        .query()
        .expand('CachedObjectList-Pages')
        .execute()
        .$promise.then(({ data: contactsList }) => {
          // filter contact that are not already added
          // this avoid loosing contact object reference
          // then add contact to contact list (at given index)

          const contactsToAdd = contactsList.filter(
            (contact) => !contacts.some(({ id }) => contact.id === id),
          );

          forEach(contactsToAdd, (contact) => {
            selff.addContact(contact);
          });

          return contacts;
        });
    };

    /**
     *  @ngdoc method
     *  @name ovhContact.service:ovhContact#getCreationRules
     *  @methodOf ovhContact.service:ovhContact
     *
     *  @description
     *  Get the rules for creating a new ovh contact.
     *
     *  @return {Object} Representing the rules for creating an new contact.
     */
    ovhContactService.getCreationRules = function getCreationRules() {
      let models = null;

      function updateCreationRules(rules) {
        angular.forEach(rules, (value, key) => {
          if (angular.isDefined(models[value.fullType])) {
            if (models[value.fullType]) {
              if (angular.isArray(models[value.fullType].enum)) {
                const enumId = models[value.fullType].id
                  .replace(/Enum$/, '')
                  .toLowerCase();
                set(rules, `${key}.values`, []);
                angular.forEach(models[value.fullType].enum, (enumValue) => {
                  rules[key].values.push({
                    label: $translate.instant(
                      [
                        ['country', 'language'].indexOf(enumId) > -1
                          ? enumId
                          : snakeCase(`ovh_contact_edit_${enumId}`),
                        enumValue,
                      ].join('_'),
                    ),
                    value: enumValue,
                  });
                });
              } else if (angular.isObject(models[value.fullType].properties)) {
                angular.forEach(
                  updateCreationRules(models[value.fullType].properties),
                  (subValue, subKey) => {
                    // eslint-disable-next-line no-param-reassign
                    rules[`${key}.${subKey}`] = subValue;
                  },
                );
              }
            }
          }

          // TODO API hack, phone is mandatory
          if (key === 'phone') {
            set(value, 'canBeNull', 0);
          } else if (key === 'email') {
            set(value, 'regularExpression', CONTACT_EMAIL_REGEX);
          }
        });
        return rules;
      }

      return getApiSchemas().then(({ models: schemaModels }) => {
        models = schemaModels;
        return updateCreationRules(models['contact.Contact'].properties);
      });
    };

    /* ----------  CONNECTED USER  ----------*/

    /**
     *  @ngdoc method
     *  @name ovhContact.service:ovhContact#getConnectedUser
     *  @methodOf ovhContact.service:ovhContact
     *
     *  @description
     *  Get the connected user informations. Call GET /me API.
     *
     *  @return {Object} Representing the connected user.
     */
    ovhContactService.getConnectedUser = function getConnectedUser() {
      return OvhApiMe.v6().get().$promise;
    };

    /**
     *  @ngdoc method
     *  @name ovhContact.service:ovhContact#convertConnectedUserToContact
     *  @methodOf ovhContact.service:ovhContact
     *
     *  @description
     *  Convert the connected user nic to an ovh contact.
     *
     *  @return {Promise} That returns an OvhContact instance.
     */
    ovhContactService.convertConnectedUserToContact = function convertConnectedUserToContact() {
      return this.getConnectedUser().then((nic) =>
        getApiSchemas().then(() => new OvhContact(convertNicToContact(nic))),
      );
    };

    return ovhContactService;
  };
}
