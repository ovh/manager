import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import 'ovh-api-services';

import backupInstance from '../instance/backup/backup.module';
import routing from './backup.routing';

const moduleName = 'ovhManagerPciInstancesBackup';

angular
  .module(moduleName, [
    backupInstance,
    'ui.router',
    'oui',
    'ovh-api-services',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing);

export default moduleName;
