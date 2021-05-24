import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './notebook-attach.component';

const moduleName = 'ovhManagerPciProjectNotebooksNotebookAttach';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component('notebookAttach', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
