import sortBy from 'lodash/sortBy';

export default class BillingPaymentMethodAddBillingContactViewCtrl {
  /* @ngInject */
  constructor(ovhContacts) {
    this.ovhContacts = ovhContacts;

    // attributes used in view
    this.activeTab = null;
    this.contactList = null;
    this.defaultContact = null;
  }

  static sortContacts(contacts) {
    return sortBy(contacts, 'lastName');
  }

  addContact(contact) {
    this.contactList.push(contact);
    this.contactList = BillingPaymentMethodAddBillingContactViewCtrl.sortContacts(
      this.contactList,
    );
    return this.contactList;
  }

  /* =============================
  =            Events            =
  ============================== */

  onExistingContactTabActive() {
    this.activeTab = 'existing';
    this.model.billingContact = this.defaultContact;
  }

  onNewContactTabActive() {
    this.activeTab = 'new';
    this.model.billingContact = {
      address: {},
    };
  }

  /* -----  End of Events  ------ */

  /* ============================
  =            Hooks            =
  ============================= */

  $onInit() {
    this.addSteps.billingContact.loading = true;
    this.activeTab = 'existing';

    this.ovhContacts
      .getContacts()
      .then((contacts) => {
        this.contactList = BillingPaymentMethodAddBillingContactViewCtrl.sortContacts(
          contacts,
        );
        return this.ovhContacts.findMatchingContactFromNic(null, contacts);
      })
      .then((contact) => {
        this.defaultContact = contact;
        if (!contact.id) {
          this.addContact(contact);
        }

        // set model
        this.model.billingContact = this.defaultContact;
      })
      .finally(() => {
        this.addSteps.billingContact.loading = false;
      });
  }

  /* -----  End of Hooks  ------ */
}
