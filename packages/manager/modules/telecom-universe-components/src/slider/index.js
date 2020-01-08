import angular from 'angular';

import tucSliderDirective from './slider.directive';

import './slider.less';

const moduleName = 'tucSlider';

angular.module(moduleName, []).directive('tucSlider', tucSliderDirective);

export default moduleName;
