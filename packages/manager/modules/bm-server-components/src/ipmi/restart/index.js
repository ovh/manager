import angular from 'angular';

import '@ovh-ux/ui-kit';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ng-at-internet';
import ovhManagerCore from '@ovh-ux/manager-core';
import ngOvhUtils from '@ovh-ux/ng-ovh-utils';

import component from './component';
import service from '../service';

const moduleName = 'ovhManagerDedicatedServerIpmiRestartComponent';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    'ngTranslateAsyncLoader',
    'ngAtInternet',
    ovhManagerCore,
    ngOvhUtils,
  ])
  .component('serverIpmiRestart', component)
  .service('IpmiService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
