import angular from 'angular';

import advancedOptions from './advanced-options';
import accordian from './accordion';
import dropdownMenu from './dropdown-menu';
import dualList from './dual-list';
import message from './message';
import modal from './modal';
import page from './page';
import tabs from './tabs';

import './grid.less';

const moduleName = 'ngOvhCloudUniverseComponentsCui';

angular.module(moduleName, [
  advancedOptions,
  accordian,
  dropdownMenu,
  dualList,
  message,
  modal,
  page,
  tabs,
]);
export default moduleName;
