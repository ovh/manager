import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';

import routing from './soft-reboot.routing';
import softReboot from '../instance/soft-reboot/soft-reboot.module';

const moduleName = 'ovhManagerPciBaremetalSoftReboot';

angular
  .module(moduleName, [
    softReboot,
    'ui.router',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing);

export default moduleName;
