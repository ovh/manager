import angular from 'angular';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import translate from 'angular-translate';

import serverBandwidthFilter from './bandwidth.filter';

const moduleName = 'serverBandwidth';

angular
  .module(moduleName, [ngTranslateAsyncLoader, translate])
  .filter('serverBandwidth', serverBandwidthFilter)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
