import angular from 'angular';
import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ui-router-layout';
import '@uirouter/angularjs';
import 'angular-translate';

import routing from './wifi-config-modal.routing';
import component from './wifi-config-modal.component';

const moduleName = 'ovhManagerTelecomPackConfigWifiModal';

angular
  .module(moduleName, [
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    'ngUiRouterLayout',
  ])
  .config(routing)
  .component('configWifiModal', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
