import angular from 'angular';

import '@ovh-ux/ui-kit';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ng-at-internet';
import ovhManagerCore from '@ovh-ux/manager-core';
import ngOvhUtils from '@ovh-ux/ng-ovh-utils';

import component from './component';
import service from './service';
import polling from '../polling/polling.service';

const moduleName = 'ovhManagerDedicatedServerIpmiComponent';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    'ngTranslateAsyncLoader',
    'ngAtInternet',
    ovhManagerCore,
    ngOvhUtils,
  ])
  .component('serverIpmi', component)
  .service('IpmiService', service)
  .service('Polling', polling)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
