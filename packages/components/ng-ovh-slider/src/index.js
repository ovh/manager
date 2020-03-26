import angular from 'angular';

import directive from './directive';

const moduleName = 'ngOvhSlider';

angular.module(moduleName, []).directive('ovhSlider', directive);

export default moduleName;
