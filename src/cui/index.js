import angular from 'angular';

import message from './message';
import tabs from './tabs';

const moduleName = 'ngOvhCloudUniverseComponentsCui';

angular
  .module(moduleName, [
    message,
    tabs,
  ]);

export default moduleName;
