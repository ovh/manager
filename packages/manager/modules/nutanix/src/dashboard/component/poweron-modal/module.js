import angular from 'angular';
import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './component';

const moduleName = 'ovhManagerNutanixPowerOnNutanixNodeModal';

angular
  .module(moduleName, [
    'oui',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component('powerOnNutanixNodeModal', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
