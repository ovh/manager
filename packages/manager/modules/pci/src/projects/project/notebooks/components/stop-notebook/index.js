import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './stop-notebook.component';

const moduleName = 'ovhManagerPciNotebooksStopNotebookLazyLoading';

angular
  .module(moduleName, [
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .component('pciNotebooksStopNotebook', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
