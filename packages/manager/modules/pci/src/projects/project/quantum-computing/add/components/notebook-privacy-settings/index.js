import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './notebook-privacy-settings.component';

const moduleName =
  'ovhManagerPciProjectQuantumComputingNotebookPrivacySettings';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component('notebookPrivacySettings', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
