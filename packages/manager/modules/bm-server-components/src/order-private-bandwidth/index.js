import angular from 'angular';

import '@ovh-ux/ui-kit';
import 'angular-translate';
import '@ovh-ux/ng-at-internet';
import '@ovh-ux/ng-translate-async-loader';

import component from './component';
import service from './service';

const moduleName = 'ovhManagerBmServerComponentsOrderPrivateBandwidthComponent';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    'ngAtInternet',
    'ngTranslateAsyncLoader',
  ])
  .component('serverOrderPrivateBandwidth', component)
  .service('OrderPrivateBandwidthService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
