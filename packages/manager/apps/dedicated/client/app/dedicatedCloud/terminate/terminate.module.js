import angular from 'angular';
import 'angular-translate';

import ngOvhFeatureFlipping from '@ovh-ux/ng-ovh-feature-flipping';

import component from './terminate.component';
import routing from './dedicatedCloud-terminate.routes';

const moduleName = 'ovhManagerDedicatedCloudTerminate';

angular
  .module(moduleName, [ngOvhFeatureFlipping])
  .component('dedicatedCloudTerminate', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
