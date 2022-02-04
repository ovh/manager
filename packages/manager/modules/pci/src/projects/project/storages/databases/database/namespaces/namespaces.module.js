import angular from 'angular';

import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ng-ovh-swimming-poll';
import '@ovh-ux/ui-kit';

import component from './namespaces.component';
import routing from './namespaces.routing';
import addNamespace from './add';
import editNamespace from './edit';
import deleteNamespace from './delete';

const moduleName = 'ovhManagerPciStoragesDatabasesNamespaces';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'ngOvhSwimmingPoll',
    'oui',
    addNamespace,
    editNamespace,
    deleteNamespace,
  ])
  .config(routing)
  .component('ovhManagerPciStoragesDatabaseNamespacesComponent', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
