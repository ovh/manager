import contacts from './contacts';
import routing from './account.routing';

const moduleName = 'ovhManagerDedicatedAccount';

angular
  .module(moduleName, [
    contacts,
    'oui',
    'pascalprecht.translate',
    'ui.bootstrap',
    'ui.router',
  ])
  .config(routing);

export default moduleName;
