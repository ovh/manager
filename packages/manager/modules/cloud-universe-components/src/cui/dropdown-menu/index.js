import angular from 'angular';

import component from './component';

import './index.less';

const moduleName = 'cuiDropdownMenu';

angular.module(moduleName, []).component('cuiDropdownMenu', component);

export default moduleName;
