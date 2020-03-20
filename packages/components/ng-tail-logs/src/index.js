import angular from 'angular';
import 'angularjs-scroll-glue';

import component from './component';
import service from './service';

import './index.less';

const moduleName = 'ngTailLogs';

angular
  .module(moduleName, ['luegg.directives'])
  .component('tailLogs', component)
  .service('TailLogs', service);

export default moduleName;
