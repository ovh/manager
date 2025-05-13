import angular from 'angular';

import wucProgressBarElementCounterDirective from './progressBarElementCounter.directive';

const moduleName = 'wucProgressBarElementCounter';

angular
  .module(moduleName, [])
  .directive(
    'wucProgressBarElementCounter',
    wucProgressBarElementCounterDirective,
  );

export default moduleName;
