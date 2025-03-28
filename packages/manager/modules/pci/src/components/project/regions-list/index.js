import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './regions-list.component';
import service from './regions.service';
import PciStoragesContainersService from '../../../projects/project/storages/containers/containers.service';

const moduleName = 'ovhManagerPciRegionsList';

angular
  .module(moduleName, [
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .component('pciProjectRegionsList', component)
  .service('PciProjectRegions', service)
  .service('PciProjectStorageContainersService', PciStoragesContainersService)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
