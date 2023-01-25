import angular from 'angular';

import component from './upgrade-storage.component';
import routing from './upgrade-storage.routing';

import diskSizeComponent from '../../../components/disk-size';

const moduleName =
  'ovhManagerPciStoragesDatabaseGeneralInformationUpgradeStorage';

angular
  .module(moduleName, [diskSizeComponent])
  .config(routing)
  .component(
    'ovhManagerPciProjectDatabaseGeneralInformationUpgradeStorage',
    component,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
