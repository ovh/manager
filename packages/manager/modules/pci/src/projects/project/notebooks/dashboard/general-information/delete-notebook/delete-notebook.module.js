import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './delete-notebook.component';
import routing from './delete-notebook.routing';

const moduleName = 'ovhManagerPciNotebooksNotebookDashboardNotebookDelete';

angular
  .module(moduleName, [
    'ui.router',
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing)
  .component('pciNotebooksNotebookDashboardNotebookDelete', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
