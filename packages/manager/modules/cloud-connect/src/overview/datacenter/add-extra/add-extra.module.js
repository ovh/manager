import angular from 'angular';

import component from './add-extra.component';
import routing from './add-extra.routing';

const moduleName = 'ovhCloudConnectDatacenterAddExtra';

angular
  .module(moduleName, [])
  .config(routing)
  .component('cloudConnectDatacenterAddExtra', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
