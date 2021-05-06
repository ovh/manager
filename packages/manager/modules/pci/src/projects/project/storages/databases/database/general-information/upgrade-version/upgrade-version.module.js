import angular from 'angular';

import component from './upgrade-version.component';
import routing from './upgrade-version.routing';

const moduleName =
  'ovhManagerPciStoragesDatabaseGeneralInformationUpgradeVersion';

angular
  .module(moduleName, [])
  .config(routing)
  .component(
    'ovhManagerPciProjectDatabaseGeneralInformationUpgradeVersion',
    component,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
