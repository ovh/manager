import angular from 'angular';

import tucSuccessDrawingCheck from './successDrawingCheck.component';

import './successDrawingCheck.less';

const moduleName = 'tucSuccessDrawingCheck';

angular
  .module(moduleName, [])
  .component('tucSuccessDrawingCheck', tucSuccessDrawingCheck);

export default moduleName;
