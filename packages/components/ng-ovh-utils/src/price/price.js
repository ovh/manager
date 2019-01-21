import angular from 'angular';
import translate from 'angular-translate';

import priceFilter from './price-filter';

const moduleName = 'ua.price';

angular
  .module('ua.price', [translate])
  .filter('price', priceFilter)
  .run(/* @ngTranslationsInject ./translations */);

export default moduleName;
