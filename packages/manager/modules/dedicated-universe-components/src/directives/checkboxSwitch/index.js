import angular from 'angular';

import checkboxSwitchDirective from './checkboxSwitch';
import './checkboxSwitch.css';
import './checkboxSwitch-2.css';

const moduleName = 'ducCheckboxSwitch';

angular
  .module(moduleName, [])
  .directive('checkboxSwitch', checkboxSwitchDirective);

export default moduleName;
