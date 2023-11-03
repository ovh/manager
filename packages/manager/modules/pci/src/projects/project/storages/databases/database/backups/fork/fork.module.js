import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';

import forkComponent from './fork.component';
import routing from './fork.routing';
import command from './command';

import regionsList from '../../../../../../../components/project/regions-list';
import databasePlanList from '../../../components/plans-list';
import databaseFlavorsList from '../../../components/flavors-list';
import databaseDiskSize from '../../../components/disk-size';
import switchPriceComponent from '../../../components/switch-price';

const moduleName = 'ovhManagerPciStoragesDatabaseBackupsFork';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'oui',
    'ui.router',
    databasePlanList,
    databaseFlavorsList,
    databaseDiskSize,
    switchPriceComponent,
    command,
    regionsList,
  ])
  .config(routing)
  .component('ovhManagerPciStoragesDatabaseBackupsForkComponent', forkComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
