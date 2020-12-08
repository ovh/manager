import routing from './account.routing';
import config from '../config/config';
import contacts from './contacts/user-contacts.module';

const moduleName = 'ovhManagerDedicatedAccount';

angular
  .module(moduleName, [
    contacts,
    'Module.otrs',
    'oui',
    'pascalprecht.translate',
    'ui.bootstrap',
    'ui.router',
  ])
  .constant('AccountCreationURLS', config.constants.accountCreation)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
