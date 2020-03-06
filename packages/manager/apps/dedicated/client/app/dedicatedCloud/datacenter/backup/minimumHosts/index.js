import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import component from './component';
import routing from './routing';

const moduleName = 'ovhManagerDedicatedCloudBackupMinimumHosts';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ui.router',
  ])
  .config(routing)
  .component('dedicatedCloudDatacenterBackupMinimumHosts', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
