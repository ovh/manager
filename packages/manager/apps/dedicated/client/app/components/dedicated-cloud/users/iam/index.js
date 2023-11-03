import angular from 'angular';
import 'angular-translate';

import component from './iam.component';

const moduleName = 'ovhManagerDedicatedCloudIam';

angular
  .module(moduleName, [])
  .component('dedicatedCloudIam', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
