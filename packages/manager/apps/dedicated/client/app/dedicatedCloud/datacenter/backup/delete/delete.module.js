import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'ovh-api-services';
import '@ovh-ux/ui-kit';
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
  .component('dedicatedCloudDatacenterBackupDelete', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
