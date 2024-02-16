import angular from 'angular';
import 'angularjs-scroll-glue';

import component from './component';
import service from './service';

import './index.less';

const moduleName = 'ngLogToCustomer';

angular
  .module(moduleName, ['luegg.directives', 'pascalprecht.translate'])
  .component('logToCustomer', component)
  .service('LogToCustomer', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
