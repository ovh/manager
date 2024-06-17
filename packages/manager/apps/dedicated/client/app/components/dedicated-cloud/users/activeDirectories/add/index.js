import angular from 'angular';
import 'angular-translate';

import component from './federation-add.component';
import taskPollProgress from '../../../taskPollProgress';

const moduleName = 'ovhManagerDedicatedCloudUsersFederationAdd';

angular
  .module(moduleName, [taskPollProgress])
  .component('dedicatedCloudUsersFederationAdd', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
