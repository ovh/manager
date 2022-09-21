import angular from 'angular';

import dataProcessingNotebookStatusComponent from './notebook-status.component';

const moduleName =
  'OvhManagerPciProjectDataProcessingNotebookStatusLazyLoading';

angular
  .module(moduleName, [])
  .component(
    'pciProjectDataProcessingNotebookStatus',
    dataProcessingNotebookStatusComponent,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
