import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';

import component from './add-extra.component';
import routing from './add-extra.routing';

const moduleName = 'ovhCloudConnectDetailsDatacenterAddExtra';

angular
  .module(moduleName, ['pascalprecht.translate', 'ui.router'])
  .config(routing)
  .component('cloudConnectDetailsDatacenterAddExtra', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
