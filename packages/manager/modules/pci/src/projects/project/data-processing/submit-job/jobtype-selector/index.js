import angular from 'angular';
import '@uirouter/angularjs';

import jobTypeSelectorComponent from './jobtype-selector.component';

const moduleName = 'ovhManagerDataProcessingSubmitJobTypeSelector';

angular
  .module(moduleName, ['ui.router'])
  .component('dataprocessingSubmitJobTypeSelector', jobTypeSelectorComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
