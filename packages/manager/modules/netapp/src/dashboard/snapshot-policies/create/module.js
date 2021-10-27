import angular from 'angular';
import '@ovh-ux/manager-core';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';

import './style.scss';

import component from './component';
import routing from './routing';

const moduleName = 'ovhManagerNetAppSnapshotPoliciesCreate';

angular
  .module(moduleName, ['ovhManagerCore', 'pascalprecht.translate', 'ui.router'])
  .component('ovhManagerNetAppSnapshotPoliciesCreate', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
