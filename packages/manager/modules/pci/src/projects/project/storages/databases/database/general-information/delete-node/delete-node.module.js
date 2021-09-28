import angular from 'angular';
import ovhManagerCatalogPrice from '@ovh-ux/manager-catalog-price';

import component from './delete-node.component';
import routing from './delete-node.routing';

const moduleName = 'ovhManagerPciStoragesDatabaseGeneralInformationDeleteNode';

angular
  .module(moduleName, [ovhManagerCatalogPrice])
  .config(routing)
  .component(
    'ovhManagerPciProjectDatabaseGeneralInformationDeleteNode',
    component,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
