import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ui-kit';

import routing from './volume-backup.routing';
import component from './volume-backup.component';
import service from './volume-backup.service';

import create from './create';
import onboarding from './onboarding';
import list from './list';

const moduleName = 'ovhManagerPciProjectStoragesVolumeBackup';

angular
  .module(moduleName, [
    'ui.router',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'oui',
    'ngOvhCloudUniverseComponents',
    onboarding,
    create,
    list,
    // dashboard,
  ])
  .config(routing)
  .component('ovhManagerPciProjectsProjectStoragesVolumeBackup', component)
  .service('VolumeBackupService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
