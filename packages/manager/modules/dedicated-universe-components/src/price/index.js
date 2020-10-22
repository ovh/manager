import angular from 'angular';
import translate from 'angular-translate';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';

import ducPriceFilter from './price.filter';

const moduleName = 'ducPrice';

angular
  .module(moduleName, [ngTranslateAsyncLoader, translate])
  .filter('ducPrice', ducPriceFilter)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
