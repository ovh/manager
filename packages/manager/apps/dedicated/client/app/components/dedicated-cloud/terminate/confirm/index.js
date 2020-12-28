import angular from 'angular';
import 'angular-translate';

import ngOvhFeatureFlipping from '@ovh-ux/ng-ovh-feature-flipping';

import component from './dedicatedCloud-terminate-confirm.component';

const moduleName = 'ovhManagerDedicatedCloudTerminateConfirm';

angular
  .module(moduleName, [ngOvhFeatureFlipping])
  .component('dedicatedCloudTerminateConfirm', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
