import { defaults, find, head, isFunction, sortBy } from 'lodash-es';

export default /* @ngInject */ function($q, ovhContact) {
  const self = this;

  self.loading = {
    init: false,
  };

  self.list = null;

  function checkDefaultOptions() {
    self.options = defaults(self.options || {}, {
      allowCreation: true,
      allowEdition: true,
      autoCreateContact: true,
    });
  }

  self.searchInList = function searchInList(search) {
    if (search) {
      return self.list.filter(
        (contact) =>
          contact.firstName.toLowerCase().includes(search.toLowerCase()) ||
          contact.lastName.toLowerCase().includes(search.toLowerCase()),
      );
    }

    return self.list;
  };

  self.editContact = function editContact() {
    self.ovhContactCtrl.contact.startEdition();
  };

  self.createContact = function createContact() {
    self.ovhContactCtrl.startContactCreation().startEdition();
  };

  self.$onInit = function $onInit() {
    let initPromise = $q.when(true);

    self.loading.init = true;
    self.ovhContactCtrl.loading.load = true;

    // check options
    checkDefaultOptions();

    if (!self.customList) {
      initPromise = ovhContact.getContactList().then((contacts) => {
        // check if there is a filter to apply
        self.list = sortBy(
          self.filter && isFunction(self.filter())
            ? self.filter()(contacts)
            : contacts,
          'lastName',
        );

        // auto select a contact from connected nic
        if (
          !self.ovhContactCtrl.contact &&
          self.list.length === 0 &&
          self.options.autoCreateContact
        ) {
          initPromise = ovhContact
            .convertConnectedUserToContact()
            .then((contactFromNic) =>
              contactFromNic.create().then(() => {
                ovhContact.addContact(contactFromNic);
                self.ovhContactCtrl.contact = contactFromNic;
              }),
            );
        } else if (!self.ovhContactCtrl.contact) {
          initPromise = ovhContact.getConnectedUser().then((user) => {
            self.ovhContactCtrl.contact =
              find(self.list, {
                lastName: user.name,
                firstName: user.firstname,
                email: user.email,
              }) || self.list[0];
          });
        } else if (!find(self.list, { id: self.ovhContactCtrl.contact.id })) {
          self.ovhContactCtrl.contact = head(self.list);
        }
      });
    } else {
      self.list = sortBy(
        self.filter && isFunction(self.filter())
          ? self.filter()(self.customList)
          : self.customList,
        'lastName',
      );
      self.ovhContactCtrl.contact = head(self.list);
    }

    return initPromise.then(self.ovhContactCtrl.manageOnInit).finally(() => {
      self.loading.init = false;
      self.ovhContactCtrl.loading.load = false;
    });
  };
}
