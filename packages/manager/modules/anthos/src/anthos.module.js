import angular from 'angular';

import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import routing from './anthos.routing';
import component from './anthos.component';
import service from './anthos-tenants.service';

const moduleName = 'ovhManagerAnthos';

angular
  .module(moduleName, [
    'ovhManagerCore',
    'pascalprecht.translate',
    'oui',
    'ui.router',
  ])
  .config(routing)
  .component('anthosTenants', component)
  .service('AnthosTenantsService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
