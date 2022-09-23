import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';

import component from './taskPollProgress.component';

const moduleName = 'ovhManagerDedicatedCloudTaskPollProgress';

angular
  .module(moduleName, ['ngTranslateAsyncLoader', 'pascalprecht.translate'])
  .component('dedicatedCloudTaskPollProgress', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
