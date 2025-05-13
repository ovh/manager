import angular from 'angular';
import '@ovh-ux/manager-core';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-at-internet';
import '@ovh-ux/ng-at-internet-ui-router-plugin';

import create from './create';

import component from './component';
import routing from './routing';

const moduleName = 'ovhManagerNetAppSnapshotPolicies';

angular
  .module(moduleName, [
    create,
    'ovhManagerCore',
    'ngAtInternet',
    'ngAtInternetUiRouterPlugin',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component('ovhManagerNetAppSnapshotPolicies', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
