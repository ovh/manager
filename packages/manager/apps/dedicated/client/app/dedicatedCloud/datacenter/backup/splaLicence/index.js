import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import component from './component';
import routing from './routing';

const moduleName = 'ovhManagerDedicatedCloudBackupSplaLicence';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ui.router',
  ])
  .config(routing)
  .component('dedicatedCloudDatacenterBackupSplaLicence', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
