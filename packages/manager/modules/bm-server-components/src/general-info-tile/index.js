import angular from 'angular';

import '@ovh-ux/ui-kit';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ng-at-internet';
import ovhManagerCore from '@ovh-ux/manager-core';

import datacenter from '../datacenter';
import component from './component';

const moduleName = 'ovhManagerDedicatedServerGeneralInfoTileComponent';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    'ngTranslateAsyncLoader',
    'ngAtInternet',
    ovhManagerCore,
    datacenter,
  ])
  .component('serverGeneralInfo', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
