import angular from 'angular';
import '@ovh-ux/ng-ovh-swimming-poll';
import 'ovh-api-services';
import 'ovh-ui-angular';

import component from './backup.component';
import routing from './backup.routing';
import planUpgrade from './plan-upgrade';

const moduleName = 'ovhManagerDedicatedCloudBackupModule';

angular
  .module(moduleName, [
    'ngOvhSwimmingPoll',
    'oui',
    'ovh-api-services',
    planUpgrade,
  ])
  .config(routing)
  .component('ovhManagerDedicatedCloudBackup', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
