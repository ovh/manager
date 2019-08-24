import angular from 'angular';
import moment from 'moment';

// lodash imports
import find from 'lodash/find';
import get from 'lodash/get';
import groupBy from 'lodash/groupBy';
import has from 'lodash/has';
import indexOf from 'lodash/indexOf';
import isEqual from 'lodash/isEqual';
import keyBy from 'lodash/keyBy';
import keys from 'lodash/keys';
import last from 'lodash/last';
import map from 'lodash/map';
import set from 'lodash/set';
import startsWith from 'lodash/startsWith';

import {
  CONTACT_TO_NIC_FIELDS_MAPPING,
} from '../ovh-contacts.constants';

const getMappedKey = (property, prefix) => {
  let mappedKey = property;
  const fullProperty = prefix ? `${prefix}.${property}` : property;

  if (has(CONTACT_TO_NIC_FIELDS_MAPPING, fullProperty)) {
    mappedKey = get(CONTACT_TO_NIC_FIELDS_MAPPING, fullProperty);
  }
  return mappedKey;
};

export default class OvhContactsHelper {
  /**
   *  Filter the contacts in given list that have the same lastName, firstName and address
   *  @param  {Array} contacts The list of contacts to filter
   *  @return {Array}          The contacts list without duplicates.
   */
  static filterSimilarContacts(contacts) {
    const groupedContacts = groupBy(contacts, (contact) => {
      // group contact to detect contact that are the same
      const contactCopy = {
        lastName: contact.lastName,
        firstName: contact.firstName,
        email: contact.email,
      };
      if (contact.address) {
        contactCopy.address = {
          country: contact.address.country,
          line1: contact.address.line1,
          zip: contact.address.zip,
          city: contact.address.city,
        };
      }
      return JSON.stringify(contactCopy);
    });

    return map(groupedContacts, (groups) => groups[0]);
  }

  static normalizeDate(date) {
    if (!date) {
      return null;
    }

    // check if date is valid
    const momentDate = moment(new Date(date));
    if (!momentDate.isValid()) {
      return null;
    }

    return momentDate.format('YYYY-MM-DD');
  }

  static normalizePhoneNumber(phoneNumberParam, phonePrefix) {
    let phoneNumber = phoneNumberParam;
    if (phoneNumber) {
      phoneNumber = phoneNumber.replace(/\s/g, '');
      phoneNumber = phoneNumber.replace(/(?:-)(\d)/g, '$1'); // remove "-" char preceding a digit
      phoneNumber = phoneNumber.replace(/(?:\.)(\d)/g, '$1'); // remove "." char preceding a digit
      phoneNumber = phoneNumber.replace(/(?:\()(\d+)(?:\))/g, '$1'); // remove parenthesis around digits

      if (phonePrefix) {
        const alternativePhonePrefix = `00${phonePrefix.replace('+', '')}`;
        if (startsWith(phoneNumber, alternativePhonePrefix)) {
          phoneNumber = `${phonePrefix}${phoneNumber.slice(alternativePhonePrefix.length)}`;
        }
      }
    }
    return phoneNumber;
  }

  /**
   *  Convert a given nic to contact.
   *  @param  {Object} nic               The nic to convert.
   *  @param  {Object} contactProperties The full list of contact properties.
   *  @return {Object}                   The options for creating new contact from nic informations
   */
  static convertNicToContact(nic, contactProperties) {
    const contact = {};
    let nicVal;

    keys(contactProperties).forEach((propKey) => {
      if (propKey === 'address') {
        keys(contactProperties.address).forEach((addressPropKey) => {
          nicVal = get(nic, getMappedKey(addressPropKey, 'address'), null);
          set(contact, `address.${addressPropKey}`, nicVal);
        });
      } else {
        nicVal = get(
          nic,
          getMappedKey(propKey),
          get(nic, getMappedKey(propKey.toLowerCase()), null),
        );
        set(contact, propKey, nicVal);
      }
    });

    return contact;
  }

  /**
   *  Try to find a contact that match a nic (the nic needs to be transformed to contact).
   *  @param  {Object} transformedNic A nic transformed to contact.
   *  @param  {Array}  contacts       A list of contacts to search into.
   *  @return {Object}                A contact that match the transformed nic.
   *                                  If none found, an instance of OvhContact
   *                                  with nic informations.
   */
  static findMatchingContactFromNic(transformedNic, contacts) {
    let contact = null;

    contact = find(contacts, (contactParam) => {
      const copiedContact = angular.copy(contactParam);
      copiedContact.id = null;
      return isEqual(transformedNic, copiedContact);
    });

    return contact || transformedNic;
  }

  /**
   *  Merge contact.Contact enum properties with contact.Address enum properties.
   *  @param  {Object} contactProperties        contact.Contact enum properties
   *  @param  {Object} contactAddressProperties contact.Address enum properties
   *  @return {Object}                          Merged  enum properties.
   */
  static mergeContactEnumsProperties(contactProperties, contactAddressProperties) {
    const contactProps = contactProperties;
    const contactAddressProps = contactAddressProperties;

    map(contactProps, (propParam, propKey) => {
      const prop = propParam;
      set(prop, 'name', propKey);
      return prop;
    });

    contactProps.address = {};
    keys(contactAddressProps).forEach((propKey) => {
      contactAddressProps[propKey].name = `address.${propKey}`;
      set(contactProps, `address.${propKey}`, contactAddressProps[propKey]);
    });

    return contactProps;
  }

  /**
   *  Merge the contact properties with /newAccount/rules.
   *  @param  {Object} apiSchemas           The schema of /me API.
   *  @param  {Array}  rules                An array containing the nic creation rules
   *  @param  {Array}  predefinedProperties An array containing the list of contact creation fields.
   *  @return {Object}                      An object with necessary fields for contact creation.
   */
  static mergeContactPropertiesWithCreationRules(
    apiSchemas, rules, predefinedProperties, nicValue,
  ) {
    const meContactApi = find(apiSchemas.apis, {
      path: '/me/contact',
    });

    // take the POST operations parameters as the API schema allows null value and POST not...
    const postParams = keyBy(find(meContactApi.operations, {
      httpMethod: 'POST',
    }).parameters, 'name');
    const addressProps = get(apiSchemas, 'models["contact.Address"].properties');
    const addressPostParam = keyBy(map(addressProps, (param) => {
      const postParam = param;
      postParam.required = !postParam.canBeNull;
      postParam.name = last(postParam.name.split('.'));
      delete postParam.canBeNull;
      return postParam;
    }), 'name');

    const contactProps = OvhContactsHelper.mergeContactEnumsProperties(
      postParams,
      addressPostParam,
    );

    const setContactFieldRule = (contactProp, rule, fullType, keyPrefix = '') => {
      // set enum if propery have one
      if (fullType.indexOf('.') > -1) {
        const typeEnum = get(apiSchemas, `models['${fullType}'].enum`, null);
        set(contactProps, `${contactProp}.enum`, typeEnum);
      } else if (rule.in) {
        set(contactProps, `${contactProp}.enum`, rule.in);
      }

      // override required with creation rule value
      set(contactProps, `${contactProp}.required`, rule.mandatory);

      // set default value if provided by rule
      if (!rule.mandatory) {
        set(contactProps, `${contactProp}.defaultValue`, '');
      } else {
        set(contactProps, `${contactProp}.defaultValue`, rule.defaultValue);
      }

      set(
        contactProps,
        `${contactProp}.initialValue`,
        nicValue[contactProp.replace(`${keyPrefix}.`, '')], // TODO need to refactor this
      );

      // set regular expression if provided by rule
      set(contactProps, `${contactProp}.regularExpression`, rule.regularExpression);

      // set prefix and example if provided by rule
      set(contactProps, `${contactProp}.prefix`, rule.prefix);
      set(contactProps, `${contactProp}.examples`, rule.examples);
    };

    const setContactFieldsRules = (properties, prefix) => {
      const props = properties;

      keys(props).forEach((propKey) => {
        const fullProperty = get(props, propKey);
        const propertyKeyPath = prefix ? `${prefix}.${propKey}` : propKey;

        if (!has(fullProperty, 'fullType')) {
          // if fullType is not set it means that it's a nested properties object
          setContactFieldsRules(fullProperty, propertyKeyPath);
        } else if (indexOf(predefinedProperties, propertyKeyPath) > -1) {
          const rule = get(
            rules,
            getMappedKey(propKey, prefix),
            get(rules, getMappedKey(propKey, prefix).toLowerCase()),
          );

          if (rule) {
            setContactFieldRule(propertyKeyPath, rule, fullProperty.fullType, prefix);
          } else {
            delete props[propKey];
          }
        } else {
          delete props[propKey];
        }
      });
    };

    // call recursively setContactFieldsRules to set exact rules for contact creation
    setContactFieldsRules(contactProps);

    // add phone country rule
    set(contactProps, 'phoneCountry', {
      name: 'phoneCountry',
      fullType: 'nichandle.CountryEnum',
      canBeNull: 1,
    });
    setContactFieldRule('phoneCountry', get(rules, 'phoneCountry'), 'nichandle.CountryEnum');

    return contactProps;
  }
}
