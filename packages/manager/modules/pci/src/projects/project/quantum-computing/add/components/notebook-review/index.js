import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './notebook-review.component';

const moduleName = 'ovhManagerPciProjectQuantumComputingNotebookReview';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component('notebookReview', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
