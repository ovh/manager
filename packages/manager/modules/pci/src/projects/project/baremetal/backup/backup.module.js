import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';

import backup from '../instance/backup/backup.module';
import routing from './backup.routing';

const moduleName = 'ovhManagerPciBaremetalBackup';

angular
  .module(moduleName, [
    backup,
    'ui.router',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing);

export default moduleName;
