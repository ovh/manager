import angular from 'angular';

import dropdownMenu from './dropdown-menu';
import guideComponent from './guide-component';
import message from './message';
import page from './page';
import tabs from './tabs';

const moduleName = 'ngOvhCloudUniverseComponentsCui';

angular
  .module(moduleName, [
    dropdownMenu,
    guideComponent,
    message,
    page,
    tabs,
  ]);

export default moduleName;
