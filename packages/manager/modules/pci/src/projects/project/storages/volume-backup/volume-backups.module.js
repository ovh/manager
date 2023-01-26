import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ui-kit';

import routing from './volume-backups.routing';
import component from './volume-backups.component';
import service from './volume-backup.service';

// import addVolumeBackup from './add';
// import dashboard from './dashboard';
import onboarding from './onboarding';

const moduleName = 'ovhManagerPciProjectStoragesVolumeBackup';

angular
  .module(moduleName, [
    'ui.router',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'oui',
    'ngOvhCloudUniverseComponents',
    onboarding,
    // addVolumeBackup,
    // dashboard,
  ])
  .config(routing)
  .component('ovhManagerPciProjectsProjectStoragesVolumeBackup', component)
  .service('VolumeBackupService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
