import angular from 'angular';

import cuiDropdownMenu from '../dropdown-menu';

import component from './component';

import './index.less';

const moduleName = 'cuiGuideComponents';

angular
  .module(moduleName, [cuiDropdownMenu])
  .component('cuiGuideComponent', component);

export default moduleName;
