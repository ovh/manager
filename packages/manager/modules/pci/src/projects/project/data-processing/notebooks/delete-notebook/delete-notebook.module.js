import angular from 'angular';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import uiRouter from '@uirouter/angularjs';
import angularTranslate from 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './delete-notebook.component';
import routing from './delete-notebook.routing';

const moduleName = 'ovhManagerPciProjectDataProcessingQuickDeleteModal';

angular
  .module(moduleName, [
    angularTranslate,
    ngTranslateAsyncLoader,
    'oui',
    uiRouter,
  ])
  .config(routing)
  .component('pciProjectDataProcessingQuickDeleteNotebookModal', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
