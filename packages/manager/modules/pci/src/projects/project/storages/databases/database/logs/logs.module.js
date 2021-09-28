import angular from 'angular';

import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ng-ovh-swimming-poll';
import '@ovh-ux/ui-kit';

import component from './logs.component';
import routing from './logs.routing';

const moduleName = 'ovhManagerPciStoragesDatabasesLogs';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'ngOvhSwimmingPoll',
    'oui',
  ])
  .config(routing)
  .component('ovhManagerPciStoragesDatabaseLogsComponent', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
