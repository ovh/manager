import angular from 'angular';

import component from './overTheBox-logs.component';
import routing from './overTheBox-logs.routing';

const moduleName = 'ovhManagerOtbLogs';

angular
  .module(moduleName, [])
  .component('overTheBoxLogs', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
