import angular from 'angular';
import service from './user-contacts.service';

import contactsRequestChangeCtrl from './request/change/user-contacts-request-change.controller';

const moduleName = 'ovhManagerDedicatedAccountContacts';

angular
  .module(moduleName, [])
  .service('Contacts', service)
  .controller(
    'DedicatedAccountContactsRequestChangeCtrl',
    contactsRequestChangeCtrl,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
