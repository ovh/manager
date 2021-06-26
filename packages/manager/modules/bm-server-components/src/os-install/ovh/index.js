import angular from 'angular';

import '@ovh-ux/ui-kit';
import 'angular-translate';
import '@ovh-ux/ng-at-internet';
import '@ovh-ux/ng-translate-async-loader';
import ovhManagerCore from '@ovh-ux/manager-core';

import component from './component';
import service from '../service';
import hardwareRaid from '../hardware-raid';
import installationOptions from '../installation-options';
import formatSize from '../format-size';

const moduleName = 'ovhManagerBmServerComponentsOsInstallOvhComponent';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    'ngAtInternet',
    'ngTranslateAsyncLoader',
    ovhManagerCore,
    hardwareRaid,
    installationOptions,
    formatSize,
  ])
  .component('serverOsInstallOvh', component)
  .service('osInstallService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
