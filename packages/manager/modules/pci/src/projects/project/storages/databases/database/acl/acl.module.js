import angular from 'angular';

import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ng-ovh-swimming-poll';
import '@ovh-ux/ui-kit';

import component from './acl.component';
import routing from './acl.routing';
import add from './add';

const moduleName = 'ovhManagerPciStoragesDatabasesAcl';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'ngOvhSwimmingPoll',
    'oui',
    add,
  ])
  .config(routing)
  .component('ovhManagerPciStoragesDatabaseAclComponent', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
