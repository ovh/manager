import angular from 'angular';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import translate from 'angular-translate';

import serverBandwidthFilter from './bandwidth.filter';
import service from './service';

const moduleName = 'serverBandwidth';

angular
  .module(moduleName, [ngTranslateAsyncLoader, translate])
  .service('ServerBandwidthService', service)
  .filter('serverBandwidth', serverBandwidthFilter)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
