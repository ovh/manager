import angular from 'angular';

import component from './upgrade-node.component';
import routing from './upgrade-node.routing';

const moduleName =
  'ovhManagerPciStoragesDatabaseGeneralInformationUpgradeNode';

angular
  .module(moduleName, [])
  .config(routing)
  .component(
    'ovhManagerPciProjectDatabaseGeneralInformationUpgradeNode',
    component,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
