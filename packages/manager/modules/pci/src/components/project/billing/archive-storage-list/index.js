import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import component from './component';

const moduleName = 'ovhManagerPciComponentsProjectBillingArchiveStorageList';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .component('archiveStorageList', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
