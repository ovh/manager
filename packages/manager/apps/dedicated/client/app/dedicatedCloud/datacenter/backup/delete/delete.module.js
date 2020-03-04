import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'ovh-api-services';
import 'ovh-ui-angular';
import 'angular-translate';

import component from './delete.component';
import routing from './delete.routing';

const moduleName = 'ovhManagerDedicatedCloudBackupDeleteModule';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'ovh-api-services',
    'pascalprecht.translate',
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .component('dedicatedCloudDatacenterBackupDelete', component);

export default moduleName;
