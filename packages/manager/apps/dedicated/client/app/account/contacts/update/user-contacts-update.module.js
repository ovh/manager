import angular from 'angular';

import routing from './user.contacts-update.routes';

const moduleName = 'UserAccountContactsUpdate';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate', 'ui.router'])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
