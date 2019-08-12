import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import 'ovh-api-services';

import component from './reboot.component';

const moduleName = 'ovhManagerPciInstancesInstanceReboot';

angular
  .module(moduleName, [
    'ui.router',
    'oui',
    'ovh-api-services',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .component('pciInstancesInstanceReboot', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
