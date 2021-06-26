import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import filter from './filter';

const moduleName = 'ovhManagerBmServerComponentsOsInstallFormatSizeFilter';

angular
  .module(moduleName, [])
  .filter('formatSize', filter)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
