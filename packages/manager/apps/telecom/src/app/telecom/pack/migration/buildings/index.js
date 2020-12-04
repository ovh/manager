import angular from 'angular';

import 'angular-translate';

import component from './pack-migration-buildings.component';

const moduleName = 'ovhManagerTelecomPackMigrationBuildings';

angular
  .module(moduleName, ['pascalprecht.translate'])
  .component('packMigrationBuildings', component);

export default moduleName;
