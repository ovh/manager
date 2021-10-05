import angular from 'angular';

import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ng-ovh-swimming-poll';
import '@ovh-ux/ui-kit';

import component from './useracl.component';
import routing from './useracl.routing';
import add from './add';

const moduleName = 'ovhManagerPciStoragesDatabasesUserAcl';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'ngOvhSwimmingPoll',
    'oui',
    add,
  ])
  .config(routing)
  .component('ovhManagerPciStoragesDatabaseUserAclComponent', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
