import angular from 'angular';

import component from './upgrade-node.component';
import routing from './upgrade-node.routing';
import flavorsList from '../../../components/flavors-list';
import switchPriceComponent from '../../../components/switch-price';

const moduleName = 'ovhManagerPciStoragesDatabaseGeneralInformationUpgradeNode';

angular
  .module(moduleName, [flavorsList, switchPriceComponent])
  .config(routing)
  .component(
    'ovhManagerPciProjectDatabaseGeneralInformationUpgradeNode',
    component,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
