import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './regions-list.component';
import service from './regions.service';

const moduleName = 'cucPciProjectRegionsList';

angular
  .module(moduleName, [
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .component('cucPciProjectRegionsList', component)
  .service('cucPciProjectRegionsList', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
