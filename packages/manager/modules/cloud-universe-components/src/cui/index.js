import angular from 'angular';

import dropdownMenu from './dropdown-menu';
import guideComponent from './guide-component';
import message from './message';
import modal from './modal';
import page from './page';
import tabs from './tabs';

import './grid.less';

const moduleName = 'ngOvhCloudUniverseComponentsCui';

angular
  .module(moduleName, [
    dropdownMenu,
    guideComponent,
    message,
    modal,
    page,
    tabs,
  ]);
export default moduleName;
