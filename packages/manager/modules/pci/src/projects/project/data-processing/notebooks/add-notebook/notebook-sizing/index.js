import angular from 'angular';
import '@uirouter/angularjs';

import NotebookSizingComponent from './notebook-sizing.component';

const moduleName =
  'ovhManagerPciProjectDataProcessingAddNotebookNotebookSizingLazyLoading';

angular
  .module(moduleName, ['ui.router'])
  .component(
    'pciProjectDataProcessingAddNotebookNotebookSizing',
    NotebookSizingComponent,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
