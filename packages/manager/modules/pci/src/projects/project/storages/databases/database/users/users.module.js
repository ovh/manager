import angular from 'angular';

import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ui-kit';

import component from './users.component';
import routing from './users.routing';
import addUser from './add';
import deleteUser from './delete';
import informations from './informations';
import modifyPassword from './modify-password';
import showSecret from './show-secret';

const moduleName = 'ovhManagerPciStoragesDatabasesUsers';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'oui',
    addUser,
    deleteUser,
    informations,
    modifyPassword,
    showSecret,
  ])
  .config(routing)
  .component('ovhManagerPciStoragesDatabaseUsersComponent', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
