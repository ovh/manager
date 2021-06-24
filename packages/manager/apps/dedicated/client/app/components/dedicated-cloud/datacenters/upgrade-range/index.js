import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';

import component from './component';

const moduleName = 'ovhManagerDedicatedCloudUpgradeRange';

angular
  .module(moduleName, ['pascalprecht.translate', 'ngTranslateAsyncLoader'])
  .component('dedicatedCloudUpgradeRange', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
