import angular from 'angular';

import 'angular-translate';
import '@ovh-ux/ng-at-internet';
import ovhManagerCore from '@ovh-ux/manager-core';

import Datacenter from '../datacenter';
import component from './component';

const moduleName = 'ovhManagerBmServerGeneralInfoTileComponent';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    'ngAtInternet',
    ovhManagerCore,
    Datacenter,
  ])
  .component('bmServerGeneralInfo', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
