import angular from 'angular';
import '@ovh-ux/manager-core';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-ui-angular';
import 'ovh-api-services';
import 'angular-ui-bootstrap';
import '@ovh-ux/ng-ovh-user-pref';

import component from './instance-backups.component';
import service from './instance-backups.service';

import instanceBackupDelete from './instance-backup/delete';

import routing from './instance-backups.routing';

const moduleName = 'ovhManagerPciStoragesInstanceBackups';

angular
  .module(moduleName, [
    instanceBackupDelete,
    'ngOvhUserPref',
    'ngTranslateAsyncLoader',
    'oui',
    'ovh-api-services',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    'ui.bootstrap',
  ])
  .config(routing)
  .component('pciProjectStorageInstanceBackups', component)
  .service('PciProjectStorageInstanceBackupService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
