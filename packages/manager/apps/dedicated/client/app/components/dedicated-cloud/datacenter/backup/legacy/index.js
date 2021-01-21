import angular from 'angular';
import ngAtInternet from '@ovh-ux/ng-at-internet';
import 'angular-translate';

import component from './component';

const moduleName = 'ovhManagerDedicatedCloudDatacenterBackupLegacy';

angular
  .module(moduleName, [ngAtInternet])
  .component('dedicatedCloudDatacenterBackupLegacy', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
