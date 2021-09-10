import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import routing from './routing';
import storageUsage from '../../components/storage-usage';
import addStorage from '../../components/add-storage';

const moduleName = 'ovhManagerAnthosDashboardStorageAdd';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    storageUsage,
    addStorage,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
