import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-ui-angular';

import component from './regions-list.component';
import service from './regions.service';

const moduleName = 'ovhManagerPciRegionsList';

angular
  .module(moduleName, [
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .component('pciProjectRegionsList', component)
  .service('PciProjectRegions', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
