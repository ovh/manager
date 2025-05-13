import angular from 'angular';
import 'angular-translate';

import component from './iam-toggle.component';
import taskPollProgress from '../../../taskPollProgress';

const moduleName = 'ovhManagerDedicatedCloudUsersIamToggle';

angular
  .module(moduleName, [taskPollProgress])
  .component('dedicatedCloudUsersIamToggle', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
