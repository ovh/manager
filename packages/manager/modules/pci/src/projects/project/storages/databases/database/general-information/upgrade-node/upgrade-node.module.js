import angular from 'angular';

import component from './upgrade-node.component';
import routing from './upgrade-node.routing';
import flavorsList from '../../../components/flavors-list';
import diskSize from '../../../components/disk-size';

const moduleName = 'ovhManagerPciStoragesDatabaseGeneralInformationUpgradeNode';

angular
  .module(moduleName, [flavorsList, diskSize])
  .config(routing)
  .component(
    'ovhManagerPciProjectDatabaseGeneralInformationUpgradeNode',
    component,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
