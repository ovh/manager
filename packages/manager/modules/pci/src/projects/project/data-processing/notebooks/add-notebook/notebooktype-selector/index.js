import angular from 'angular';
import '@uirouter/angularjs';

import notebookTypeSelectorComponent from './notebooktype-selector.component';

const moduleName =
  'ovhManagerPciProjectDataProcessingAddNotebookTypeSelectorLazyLoading';

angular
  .module(moduleName, ['ui.router'])
  .component(
    'pciProjectDataProcessingAddNotebookTypeSelector',
    notebookTypeSelectorComponent,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
