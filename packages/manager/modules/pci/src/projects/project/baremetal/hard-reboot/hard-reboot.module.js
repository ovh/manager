import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';

import hardReboot from '../instance/hard-reboot/hard-reboot.module';
import routing from './hard-reboot.routing';

const moduleName = 'ovhManagerPciBaremetalHardReboot';

angular
  .module(moduleName, [
    hardReboot,
    'ui.router',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing);

export default moduleName;
