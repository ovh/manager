import angular from 'angular';
import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ui-router-layout';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';
import 'angular-translate';

import component from './component';
import routing from './routing';

const moduleName = 'ovhManagerNetAppVolumesCreate';

angular
  .module(moduleName, [
    'oui',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    'ngUiRouterLayout',
  ])
  .config(routing)
  .component('ovhManagerNetAppCreateVolume', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
