import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import addComponent from './component';
import routing from './routing';
import storageUsage from '../../components/storage-usage';

const moduleName = 'ovhManagerAnthosDashboardStorageAdd';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate', storageUsage])
  .config(routing)
  .component('anthosAddStorage', addComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
