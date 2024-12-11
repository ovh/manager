import angular from 'angular';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import translate from 'angular-translate';

import ducBytesFilter from './bytes.filter';

const moduleName = 'ducBytes';

angular
  .module(moduleName, [ngTranslateAsyncLoader, translate])
  .filter('ducBytes', ducBytesFilter)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
