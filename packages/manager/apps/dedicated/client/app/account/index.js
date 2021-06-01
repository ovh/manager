import contacts from './contacts';
import routing from './account.routing';
import user from './user';

const moduleName = 'ovhManagerDedicatedAccount';

angular
  .module(moduleName, [
    contacts,
    'oui',
    'pascalprecht.translate',
    'ui.bootstrap',
    'ui.router',
    user,
  ])
  .config(routing);

export default moduleName;
