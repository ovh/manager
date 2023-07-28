import angular from 'angular';

import component from './upgrade-plan.component';
import plansList from '../../../components/plans-list';
import flavorList from '../../../components/flavors-list';
import routing from './upgrade-plan.routing';
import switchPriceComponent from '../../../components/switch-price';

const moduleName = 'ovhManagerPciStoragesDatabaseGeneralInformationUpgradePlan';

angular
  .module(moduleName, [plansList, flavorList, switchPriceComponent])
  .config(routing)
  .component(
    'ovhManagerPciProjectDatabaseGeneralInformationUpgradePlan',
    component,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
