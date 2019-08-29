import angular from 'angular';

import tucCustomAsteriskDirective from './custom-asterisk.directive';

const moduleName = 'tucCustomAsterisk';

angular
  .module(moduleName, [])
  .directive('tucCustomAsterisk', tucCustomAsteriskDirective);

export default moduleName;
