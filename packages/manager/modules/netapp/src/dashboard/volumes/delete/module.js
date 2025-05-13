import angular from 'angular';
import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ui-router-layout';
import '@uirouter/angularjs';
import 'angular-translate';

import component from './component';
import routing from './routing';

const moduleName = 'ovhManagerNetAppVolumesDelete';

angular
  .module(moduleName, [
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    'ngUiRouterLayout',
  ])
  .config(routing)
  .component('ovhManagerNetAppVolumesDelete', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
