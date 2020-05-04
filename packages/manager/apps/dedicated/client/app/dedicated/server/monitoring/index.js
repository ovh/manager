import angular from 'angular';

import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-ui-angular';

import component from './monitoring.component';

const moduleName = 'ovhManagerDedicatedServerMonitoring';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate', 'ui.router'])
  .component('dedicatedServerMonitoring', component)
  .run(/* @ngTranslationsInject:json ../translations */);

export default moduleName;
