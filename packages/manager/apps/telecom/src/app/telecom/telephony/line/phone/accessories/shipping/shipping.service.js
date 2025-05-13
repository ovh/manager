import filter from 'lodash/filter';
import get from 'lodash/get';
import groupBy from 'lodash/groupBy';
import map from 'lodash/map';

export default function filterContact(contacts) {
  return filter(
    map(
      groupBy(contacts, (contact) => {
        // group contact to detect contact that are the same
        const contactCopy = {
          lastName: contact.lastName,
          firstName: contact.firstName,
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
      }),
      (groups) => groups[0],
    ),
    (contact) =>
      get(contact, 'address') &&
      ['BE', 'FR', 'CH'].includes(contact.address.country),
  );
}
