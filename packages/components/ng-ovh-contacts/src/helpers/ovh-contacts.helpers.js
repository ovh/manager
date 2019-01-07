import angular from 'angular';
import _ from 'lodash';
import moment from 'moment';

import {
  CONTACT_TO_NIC_FIELDS_MAPPING,
} from '../ovh-contacts.constants';

const getMappedKey = (property, prefix) => {
  let mappedKey = property;
  const fullProperty = prefix ? `${prefix}.${property}` : property;

  if (_.has(CONTACT_TO_NIC_FIELDS_MAPPING, fullProperty)) {
    mappedKey = _.get(CONTACT_TO_NIC_FIELDS_MAPPING, fullProperty);
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
    return _.chain(contacts)
      .groupBy((contact) => {
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
      })
      .map(groups => groups[0])
      .value();
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
        if (_.startsWith(phoneNumber, alternativePhonePrefix)) {
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

    _.keys(contactProperties).forEach((propKey) => {
      if (propKey === 'address') {
        _.keys(contactProperties.address).forEach((addressPropKey) => {
          nicVal = _.get(nic, getMappedKey(addressPropKey, 'address'), null);
          _.set(contact, `address.${addressPropKey}`, nicVal);
        });
      } else if (propKey === 'birthDay') {
        if (new RegExp(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/).test(nic.birthDay)) {
          const splittedDate = nic[propKey].split('/');
          _.set(contact, propKey, splittedDate.reverse().join('-'));
        } else {
          _.set(contact, propKey, null);
        }
      } else {
        nicVal = _.get(
          nic,
          getMappedKey(propKey),
          _.get(nic, getMappedKey(propKey.toLowerCase()), null),
        );
        _.set(contact, propKey, nicVal);
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

    contact = _.find(contacts, (contactParam) => {
      const copiedContact = angular.copy(contactParam);
      copiedContact.id = null;
      return _.isEqual(transformedNic, copiedContact);
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

    _.map(contactProps, (propParam, propKey) => {
      const prop = propParam;
      _.set(prop, 'name', propKey);
      return prop;
    });

    contactProps.address = {};
    _.keys(contactAddressProps).forEach((propKey) => {
      contactAddressProps[propKey].name = `address.${propKey}`;
      _.set(contactProps, `address.${propKey}`, contactAddressProps[propKey]);
    });

    return contactProps;
  }

  /**
   *  Merge the contact properties with /newAccount/rules.
   *  @param  {Object} apiSchemas           The schema of /me API.
   *  @param  {Array}  rules                An array containing the nic creation rules
   *  @param  {Array}  predifinedProperties An array containing the list of contact creation fields.
   *  @return {Object}                      An object with necessary fields for contact creation.
   */
  static mergeContactPropertiesWithCreationRules(apiSchemas, rules, predifinedProperties) {
    const contactProps = OvhContactsHelper.mergeContactEnumsProperties(
      _.get(apiSchemas, 'models["contact.Contact"].properties'),
      _.get(apiSchemas, 'models["contact.Address"].properties'),
    );

    const setContactFieldRule = (contactProp, rule, fullType) => {
      // set enum if propery have one
      if (fullType.indexOf('.') > -1) {
        const typeEnum = _.get(apiSchemas, `models['${fullType}'].enum`, null);
        _.set(contactProps, `${contactProp}.enum`, typeEnum);
      } else if (rule.in) {
        _.set(contactProps, `${contactProp}.enum`, rule.in);
      }

      // set default value if provided by rule
      _.set(contactProps, `${contactProp}.defaultValue`, rule.defaultValue);

      // set regular expression if provided by rule
      _.set(contactProps, `${contactProp}.regularExpression`, rule.regularExpression);

      // set prefix and example if provided by rule
      _.set(contactProps, `${contactProp}.prefix`, rule.prefix);
      _.set(contactProps, `${contactProp}.examples`, rule.examples);
    };

    const setContactFieldsRules = (properties, prefix) => {
      const props = properties;

      _.keys(props).forEach((propKey) => {
        const fullProperty = _.get(props, propKey);
        const propertyKeyPath = prefix ? `${prefix}.${propKey}` : propKey;

        if (!_.has(fullProperty, 'fullType')) {
          // if fullType is not set it means that it's a nested properties object
          setContactFieldsRules(fullProperty, propertyKeyPath);
        } else if (_.indexOf(predifinedProperties, propertyKeyPath) > -1) {
          const rule = _.get(
            rules,
            getMappedKey(propKey, prefix),
            _.get(rules, getMappedKey(propKey, prefix).toLowerCase()),
          );

          if (rule) {
            setContactFieldRule(propertyKeyPath, rule, fullProperty.fullType);
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
    _.set(contactProps, 'phoneCountry', {
      name: 'phoneCountry',
      fullType: 'nichandle.CountryEnum',
      canBeNull: 1,
    });
    setContactFieldRule('phoneCountry', _.get(rules, 'phoneCountry'), 'nichandle.CountryEnum');

    return contactProps;
  }
}
