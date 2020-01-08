import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import service from './service';

const moduleName = 'cucCloudRegion';

angular
  .module(moduleName, ['ngTranslateAsyncLoader', 'pascalprecht.translate'])
  .service('CucRegionService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
