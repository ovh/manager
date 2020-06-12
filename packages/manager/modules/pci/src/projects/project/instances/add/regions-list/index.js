import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import service from './regions-list.service';

const moduleName = 'ovhManagerPciInstancesRegionsList';

angular
  .module(moduleName, [
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .service('PciProjectRegions', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
