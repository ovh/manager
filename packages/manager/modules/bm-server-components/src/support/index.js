import angular from 'angular';

import 'angular-translate';
import '@ovh-ux/ng-at-internet';
import ovhManagerCore from '@ovh-ux/manager-core';
import { iamProtectedData } from '@ovh-ux/manager-components';

import component from './component';

const moduleName = 'ovhManagerDedicatedServerSupportTileComponent';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    'ngAtInternet',
    ovhManagerCore,
    iamProtectedData,
  ])
  .component('serverSupport', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
