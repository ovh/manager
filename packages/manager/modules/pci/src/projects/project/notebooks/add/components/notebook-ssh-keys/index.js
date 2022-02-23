import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './notebook-ssh-keys.component';

const moduleName = 'ovhManagerPciProjectNotebooksNotebookSshKeys';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component('notebookSshKeys', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
