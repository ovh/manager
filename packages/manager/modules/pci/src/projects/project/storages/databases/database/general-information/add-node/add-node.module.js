import angular from 'angular';
import ovhManagerCatalogPrice from '@ovh-ux/manager-catalog-price';

import component from './add-node.component';
import routing from './add-node.routing';
import switchPriceComponent from '../../../components/switch-price';

const moduleName = 'ovhManagerPciStoragesDatabaseGeneralInformationAddNode';

angular
  .module(moduleName, [ovhManagerCatalogPrice, switchPriceComponent])
  .config(routing)
  .component('ovhManagerPciProjectDatabaseGeneralInformationAddNode', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
