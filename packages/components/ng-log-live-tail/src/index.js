import angular from 'angular';
import 'angularjs-scroll-glue';

import component from './component';
import service from './service';

import './index.less';
import { API_VERSION } from './constants';

const moduleName = 'ngLogLiveTail';

angular
  .module(moduleName, ['luegg.directives', 'pascalprecht.translate'])
  .component('logLiveTail', component)
  .constant('API_VERSION', API_VERSION)
  .service('LogLiveTail', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
