import angular from 'angular';

import '@ovh-ux/ui-kit';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ng-at-internet';
import ngOvhUtils from '@ovh-ux/ng-ovh-utils';

import component from './component';
import service from '../service';

const moduleName = 'ovhManagerDedicatedServerOrderKvmComponent';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    'ngTranslateAsyncLoader',
    'ngAtInternet',
    ngOvhUtils,
  ])
  .component('serverOrderKvm', component)
  .service('IpmiService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
