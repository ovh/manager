import angular from 'angular';

import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './monitoring.component';

const moduleName = 'ovhManagerBmServerComponentsMonitoring';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate', 'ui.router'])
  .component('serverMonitoring', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
