import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';

import component from './list.component';
import routing from './routing';

const moduleName = 'ovhManagerPciProjectKubernetesDetailsAuditLogsList';

angular
  .module(moduleName, ['pascalprecht.translate', 'ui.router'])
  .config(routing)
  .component('pciProjectKubernetesDetailsAuditLogsList', component)
  .run(/* @ngTranslationsInject:json ../translations */);

export default moduleName;
