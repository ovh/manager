import angular from 'angular';

import '@ovh-ux/ui-kit';
import 'angular-translate';

import component from './component';
import service from './server-reboot.service';

const moduleName = 'ovhManagerBmServerComponentsServerReboot';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component('serverReboot', component)
  .service('serverRebootService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
