import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';

import component from './component';

const moduleName = 'ovhManagerDedicatedServerDatacenterComponent';

angular
  .module(moduleName, ['pascalprecht.translate', 'ngTranslateAsyncLoader'])
  .component('serverDatacenter', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
