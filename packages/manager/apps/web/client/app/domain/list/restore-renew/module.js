import angular from 'angular';
import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-ui-router-layout';
import ngAtInternet from '@ovh-ux/ng-at-internet';

import component from './component';
import routing from './routing';

const moduleName = 'ovhManagerWebDomainRestoreRenew';

angular
  .module(moduleName, [
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    'ngUiRouterLayout',
    ngAtInternet,
  ])
  .config(routing)
  .component('webdomainRestoreRenewModale', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
