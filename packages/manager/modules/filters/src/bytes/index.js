import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import bytesFilter from './bytes.filter';

const moduleName = 'ovhManagerFiltersBytes';

angular
  .module(moduleName, [])
  .filter('bytes', bytesFilter)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
