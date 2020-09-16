import endsWith from 'lodash/endsWith';
import remove from 'lodash/remove';
import startsWith from 'lodash/startsWith';

import { CONTACT_FILTERS } from './contacts-choice.constants';

export default class ContactsChoiceController {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
  }

  $onInit() {
    [this.selectedPhonebook] = this.phonebooks;
    this.selectedContacts = this.model.contacts ? [...this.model.contacts] : [];

    this.contactsFilters = CONTACT_FILTERS.map((filter) => ({
      label: this.$translate.instant(
        `sms_add_contacts_filter_select_${filter}`,
      ),
      value: filter,
    }));

    [this.selectedFilter] = this.contactsFilters;

    return this.getContacts(this.selectedPhonebook);
  }

  getContacts(selectedPhonebook) {
    this.loadingContacts = true;
    return this.getPhonebookContacts(selectedPhonebook.bookKey)
      .then((contacts) => {
        this.contacts = contacts.map((contact) => ({
          ...contact,
          ...ContactsChoiceController.getPhoneNumberAndType(contact),
        }));

        if (this.selectedContacts.length) {
          this.contacts = this.contacts.map((contact) => ({
            ...contact,
            isSelected: this.selectedContacts.some(
              ({ id }) => id === contact.id,
            ),
          }));
        }
      })
      .finally(() => {
        this.loadingContacts = false;
      });
  }

  confirmSelection() {
    this.model.contacts = this.selectedContacts;
    return this.goBack();
  }

  onContactSelection(isSelected, contact) {
    if (isSelected) {
      this.selectedContacts.push(contact);
    } else {
      remove(this.selectedContacts, ({ id }) => id === contact.id);
    }
  }

  static getPhoneNumberAndType(contact) {
    const [, ...types] = CONTACT_FILTERS;
    const phonetype = types.find((type) => contact[type] !== '');
    const phonenumber = contact[phonetype];

    return {
      phonenumber,
      phonetype,
    };
  }

  static hasSelectedContacts(contacts) {
    return contacts && contacts.some(({ isSelected }) => isSelected);
  }

  static isMobileType(phoneType) {
    return endsWith(phoneType, 'Mobile');
  }

  static isHomeType(phoneType) {
    return startsWith(phoneType, 'home');
  }
}
