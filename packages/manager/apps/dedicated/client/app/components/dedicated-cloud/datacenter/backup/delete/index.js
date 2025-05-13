import angular from 'angular';
import ngAtInternet from '@ovh-ux/ng-at-internet';
import '@ovh-ux/ng-translate-async-loader';
import 'ovh-api-services';
import '@ovh-ux/ui-kit';
import '@ovh-ux/manager-core';
import 'angular-translate';

import component from './delete.component';

const moduleName = 'ovhManagerDedicatedCloudBackupDeleteModule';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'ovh-api-services',
    'ovhManagerCore',
    'pascalprecht.translate',
    ngAtInternet,
  ])
  .component('dedicatedCloudDatacenterBackupDelete', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
