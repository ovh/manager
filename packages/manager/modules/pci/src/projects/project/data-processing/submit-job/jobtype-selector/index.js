import angular from 'angular';
import '@uirouter/angularjs';

import jobTypeSelectorComponent from './jobtype-selector.component';

const moduleName =
  'ovhManagerPciProjectDataProcessingSubmitJobTypeSelectorLazyLoading';

angular
  .module(moduleName, ['ui.router'])
  .component(
    'pciProjectDataProcessingSubmitJobTypeSelector',
    jobTypeSelectorComponent,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
