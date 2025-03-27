import angular from 'angular';
import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './component';

const moduleName = 'ovhManagerNutanixNodeActionMenuTerminated';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate', 'ui.router'])
  .component('nodeActionMenuTerminated', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
