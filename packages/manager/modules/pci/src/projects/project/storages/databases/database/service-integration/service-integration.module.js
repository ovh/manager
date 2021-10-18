import angular from 'angular';

import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ng-ovh-swimming-poll';
import '@ovh-ux/ui-kit';

import component from './service-integration.component';
import routing from './service-integration.routing';

import add from './add';
import del from './delete';

const moduleName = 'ovhManagerPciStoragesDatabasesServiceIntegration';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'ngOvhSwimmingPoll',
    'oui',
    add,
    del,
  ])
  .config(routing)
  .component(
    'ovhManagerPciStoragesDatabaseServiceIntegrationComponent',
    component,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
