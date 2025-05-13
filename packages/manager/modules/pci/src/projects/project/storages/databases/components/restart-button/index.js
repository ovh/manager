import angular from 'angular';
import '@ovh-ux/ui-kit';

import component from './restart-button.component';

const moduleName = 'ovhManagerPciStoragesDatabasesRestartButton';

angular
  .module(moduleName, ['oui'])
  .component('restartButton', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
