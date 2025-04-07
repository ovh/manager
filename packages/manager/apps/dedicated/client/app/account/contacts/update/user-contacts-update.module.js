import angular from 'angular';

import service from '../user-contacts.service';
import routing from './user.contacts-update.routes';

const moduleName = 'UserAccountContactsUpdate';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate', 'ui.router'])
  .service('UserAccountContactUpdateService', service)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
