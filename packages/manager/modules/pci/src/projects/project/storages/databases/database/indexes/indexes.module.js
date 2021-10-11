import angular from 'angular';

import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ng-ovh-swimming-poll';
import '@ovh-ux/ui-kit';

import component from './indexes.component';
import routing from './indexes.routing';
import deleteIndex from './delete-index';
import deletePattern from './delete-pattern';
import createPattern from './create-pattern';

const moduleName = 'ovhManagerPciStoragesDatabasesIndexes';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'ngOvhSwimmingPoll',
    'oui',
    deleteIndex,
    deletePattern,
    createPattern,
  ])
  .config(routing)
  .component('ovhManagerPciStoragesDatabaseIndexesComponent', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
