import { isUndefined } from 'lodash-es';

export default /* @ngInject */ function($q, $timeout, ovhContact, OvhContact) {
  const self = this;
  let tmpContact = null;

  self.loading = {
    load: false,
    init: false,
  };

  self.startContactCreation = function startContactCreation() {
    tmpContact = self.contact;
    const { customContactObject } = self.choiceOptions.options;
    self.contact = customContactObject || new OvhContact();

    return self.contact;
  };

  self.stopContactCreation = function stopContactCreation() {
    self.contact = tmpContact;
    tmpContact = null;
    return self.contact;
  };

  self.manageOnInit = function manageOnInit() {
    if (self.initDeferred) {
      return $timeout(self.initDeferred.resolve);
    }
    return $q.resolve();
  };

  self.$onInit = function onInit() {
    self.loading.init = true;

    // check params
    self.onlyCreate = self.onlyCreate === 'true';
    if (self.initDeferred && isUndefined(self.initDeferred.promise)) {
      throw new Error(
        'ng-ovh-contact: initDeferred must be a deferred object.',
      );
    }

    if (self.onlyCreate) {
      self.startContactCreation();
    }

    self.loading.init = false;
  };

  self.$onDestroy = function onDestroy() {
    if (self.contact) {
      self.contact.stopEdition(true);
    }
  };
}
