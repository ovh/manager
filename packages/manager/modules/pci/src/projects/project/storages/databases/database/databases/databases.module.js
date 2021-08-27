import angular from 'angular';

import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ng-ovh-swimming-poll';
import '@ovh-ux/ui-kit';

import component from './databases.component';
import routing from './databases.routing';
import createDatabase from './create-database';

const moduleName = 'ovhManagerPciStoragesDatabasesDatabases';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'ngOvhSwimmingPoll',
    'oui',
    createDatabase,
  ])
  .config(routing)
  .component('ovhManagerPciStoragesDatabaseDatabasesComponent', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
