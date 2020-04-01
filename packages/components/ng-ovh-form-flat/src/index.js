import angular from 'angular';

import flatCheckboxDirective from './flat-checkbox/directive';
import flatInputContainerDirective from './flat-input-container/directive';
import flatItemDirective from './flat-item/directive';
import flatRadioDirective from './flat-radio/directive';
import flatSelectDirective from './flat-select/directive';
import flatSwitchDirective from './flat-switch/directive';

import './index.less';

const moduleName = 'ngOvhFormFlat';

angular
  .module(moduleName, [])
  .directive('flatCheckbox', flatCheckboxDirective)
  .directive('flatInputContainer', flatInputContainerDirective)
  .directive('flatItem', flatItemDirective)
  .directive('flatRadio', flatRadioDirective)
  .directive('flatSelect', flatSelectDirective)
  .directive('flatSwitch', flatSwitchDirective);

export default moduleName;
