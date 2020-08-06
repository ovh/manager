import angular from 'angular';

import component from './overTheBox-configure.component';
import routing from './overTheBox-configure.routing';

const moduleName = 'ovhManagerOtbConfigure';

angular
  .module(moduleName, [])
  .config(routing)
  .component('overTheBoxConfigure', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
