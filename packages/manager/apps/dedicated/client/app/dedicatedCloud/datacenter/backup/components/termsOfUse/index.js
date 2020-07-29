import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';
import 'angular-translate';

import component from './terms-of-use.component';

const moduleName = 'ovhManagerDedicatedCloudBackupTermsOfUse';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
  ])
  .component('dedicatedCloudDatacenterBackupTermsOfUse', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
