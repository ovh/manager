import angular from 'angular';

import wucIncrementNumberDirective from './incrementNumber';

import './incrementNumber.less';

const moduleName = 'wucIncrementNumber';

angular
  .module(moduleName, [])
  .directive('wucIncrementNumber', wucIncrementNumberDirective);

export default moduleName;
