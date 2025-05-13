import angular from 'angular';
import angularTranslate from 'angular-translate';
import '@uirouter/angularjs';

import routing from './add-notebook.routing';
import regionSelector from './region-selector';
import notebookTypeSelector from './notebooktype-selector';
import notebookSizing from './notebook-sizing';
import command from './command';
import privacySelector from './privacy-selector';

import dataProcessingAddNotebookComponent from './add-notebook.component';

const moduleName = 'ovhManagerPciProjectDataProcessingAddNotebook';

angular
  .module(moduleName, [
    'ui.router',
    'ovhManagerPciComponents',
    angularTranslate,
    regionSelector,
    notebookTypeSelector,
    notebookSizing,
    privacySelector,
    command,
  ])
  .config(routing)
  .component(
    'pciProjectDataProcessingAddNotebook',
    dataProcessingAddNotebookComponent,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
