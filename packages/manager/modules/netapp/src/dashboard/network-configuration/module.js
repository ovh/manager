import angular from 'angular';
import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-ovh-feature-flipping';

import component from './component';
import routing from './routing';
import service from './service';

const moduleName = 'ovhManagerNetAppNetworkConfigurationModule';

angular
  .module(moduleName, [
    'ngOvhFeatureFlipping',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
  ])
  .config(routing)
  .component('ovhManagerNetAppNetworkConfiguration', component)
  .service('NetappNetworkConfigurationService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
