import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';

import reboot from '../../../instances/instance/reboot';
import routing from './hard-reboot.routing';

const moduleName = 'ovhManagerPciBaremetalInstanceHardReboot';

angular
  .module(moduleName, [
    reboot,
    'ui.router',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing);

export default moduleName;
