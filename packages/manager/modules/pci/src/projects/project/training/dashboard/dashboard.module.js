import angular from 'angular';
import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';

import install from './install';
import registry from './registry';

import component from './dashboard.component';
import routing from './dashboard.routing';

const moduleName = 'ovhManagerPciTrainingDashboard';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'ngTranslateAsyncLoader',
    'oui',
    'ovh-api-services',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    install,
    registry,
  ])
  .config(routing)
  .component('pciProjectTrainingDashboardComponent', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
