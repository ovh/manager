import angular from 'angular';

import dropdownMenu from './dropdown-menu';
import message from './message';
import tabs from './tabs';

const moduleName = 'ngOvhCloudUniverseComponentsCui';

angular
  .module(moduleName, [
    dropdownMenu,
    message,
    tabs,
  ]);

export default moduleName;
