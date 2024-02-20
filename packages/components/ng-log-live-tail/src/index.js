import angular from 'angular';
import 'angularjs-scroll-glue';

import component from './component';
import service from './service';

import './index.less';

const moduleName = 'ngLogLiveTail';

angular
  .module(moduleName, ['luegg.directives', 'pascalprecht.translate'])
  .component('logLiveTail', component)
  .service('LogLiveTail', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
