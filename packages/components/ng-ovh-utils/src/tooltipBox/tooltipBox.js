import angular from 'angular';

import tooltipBoxDirective from './tooltipBox-directive';
import './tooltipBox.less';

const moduleName = 'ua.tooltipBox';

angular
  .module(moduleName, [])
  .constant('tooltipBoxConfig', [
    'container',
    'selector',
    'title',
    'contentText',
    'contentTemplate',
    'placement',
    'animation',
    'unique',
    'html',
    'trigger',
    'delay',
    'hideOnBlur',
  ])
  .directive('tooltipBox', tooltipBoxDirective);

export default moduleName;
