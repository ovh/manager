import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import resourceSelector from '@ovh-ux/manager-components';
import component from './notebook-resources.component';

const moduleName = 'ovhManagerPciProjectNotebooksNotebookResources';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate', resourceSelector])
  .component('notebookResources', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
