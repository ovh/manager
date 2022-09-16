import angular from 'angular';
import angularTranslate from 'angular-translate';
import '@uirouter/angularjs';

import routing from './submit-job.routing';
import regionSelector from './region-selector';
import jobTypeSelector from './jobtype-selector';
import sparkSizing from './spark-sizing';
import sparkConfig from './spark-config';

import dataProcessingSubmitJobComponent from './submit-job.component';

const moduleName = 'ovhManagerPciProjectDataProcessingSubmitJob';

angular
  .module(moduleName, [
    'ui.router',
    'ovhManagerPciComponents',
    angularTranslate,
    regionSelector,
    jobTypeSelector,
    sparkSizing,
    sparkConfig,
  ])
  .config(routing)
  .component(
    'pciProjectDataProcessingSubmitJob',
    dataProcessingSubmitJobComponent,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
