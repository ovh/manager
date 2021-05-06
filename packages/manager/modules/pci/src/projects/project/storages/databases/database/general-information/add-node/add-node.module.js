import angular from 'angular';
import ovhManagerCatalogPrice from '@ovh-ux/manager-catalog-price';

import component from './add-node.component';
import routing from './add-node.routing';

const moduleName = 'ovhManagerPciStoragesDatabaseGeneralInformationAddNode';

angular
  .module(moduleName, [ovhManagerCatalogPrice])
  .config(routing)
  .component('ovhManagerPciProjectDatabaseGeneralInformationAddNode', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
