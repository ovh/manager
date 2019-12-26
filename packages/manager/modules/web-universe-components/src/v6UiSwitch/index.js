import angular from 'angular';

import wucV6UiSwitch from './v6UiSwitch.directive';

import './v6-ui-switch.less';

const moduleName = 'wucV6UiSwitch';

angular.module(moduleName, []).directive('wucV6UiSwitch', wucV6UiSwitch);

export default moduleName;
