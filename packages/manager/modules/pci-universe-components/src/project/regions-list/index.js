import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import 'ovh-api-services';

import { region } from '@ovh-ux/manager-components';

import component from './regions-list.component';
import service from './regions.service';

const moduleName = 'ovhManagerPciRegionsList';

angular
  .module(moduleName, [
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    region,
  ])
  .component('pciProjectRegionsList', component)
  .service('PciProjectRegions', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
