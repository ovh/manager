import angular from 'angular';

import component from './upgrade-node.component';
import routing from './upgrade-node.routing';
import flavorsList from '../../../components/flavors-list';

const moduleName = 'ovhManagerPciStoragesDatabaseGeneralInformationUpgradeNode';

angular
  .module(moduleName, [flavorsList])
  .config(routing)
  .component(
    'ovhManagerPciProjectDatabaseGeneralInformationUpgradeNode',
    component,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
