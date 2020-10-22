import angular from 'angular';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import translate from 'angular-translate';

import ducBandwidthFilter from './bandwidth.filter';

const moduleName = 'ducBandwidth';

angular
  .module(moduleName, [ngTranslateAsyncLoader, translate])
  .filter('ducBandwidth', ducBandwidthFilter)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
