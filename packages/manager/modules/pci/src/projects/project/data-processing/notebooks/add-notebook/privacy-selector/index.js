import angular from 'angular';
import '@uirouter/angularjs';

import PrivacySelectorComponent from './privacy-selector.component';

const moduleName =
  'ovhManagerPciProjectDataProcessingAddNotebookPrivacySelectorLazyLoading';

angular
  .module(moduleName, ['ui.router'])
  .component(
    'pciProjectDataProcessingAddNotebookPrivacySelector',
    PrivacySelectorComponent,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
