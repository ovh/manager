import angular from 'angular';

import 'angular-translate';
import '@ovh-ux/ng-at-internet';
import ovhManagerCore from '@ovh-ux/manager-core';

import component from './component';

const moduleName = 'ovhManagerDedicatedServerSupportTileComponent';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    'ngAtInternet',
    ovhManagerCore,
  ])
  .component('serverSupport', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
