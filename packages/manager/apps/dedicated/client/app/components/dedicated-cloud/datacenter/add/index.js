import angular from 'angular';

import 'angular-translate';
import '@ovh-ux/ui-kit';
import '@ovh-ux/ng-translate-async-loader';
import ngAtInternet from '@ovh-ux/ng-at-internet';

import component from './dedicatedCloud-datacenter-add.component';

const moduleName = 'ovhManagerDedicatedCloudDatacenterAddComponent';

angular
  .module(moduleName, [
    ngAtInternet,
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
  ])
  .component('ovhManagerDedicatedCloudDatacenterAdd', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
