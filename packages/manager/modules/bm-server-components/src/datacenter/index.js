import angular from 'angular';
import 'angular-translate';

import component from './component';

const moduleName = 'ovhManagerBmServerDatacenterComponent';

angular
  .module(moduleName, ['pascalprecht.translate'])
  .component('bmServerDatacenter', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
