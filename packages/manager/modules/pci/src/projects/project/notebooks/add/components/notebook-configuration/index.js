import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './notebook-configuration.component';

const moduleName = 'ovhManagerPciProjectNotebooksNotebookConfiguration';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component('notebookConfiguration', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
