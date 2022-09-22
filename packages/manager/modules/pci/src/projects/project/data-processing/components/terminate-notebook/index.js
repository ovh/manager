import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './terminate-notebook.component';

const moduleName = 'ovhManagerPciDataProcessingNotebooksTerminateNotebook';

angular
  .module(moduleName, [
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .component(
    'ovhManagerPciProjectDataProcessingNotebooksTerminateNotebook',
    component,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
