import angular from 'angular';

import cui from './cui';
import cucMessage from './message';
import cucNavigation from './navigation';
import cucProducts from './products';

const moduleName = 'ngOvhCloudUniverseComponents';

angular
  .module(moduleName, [
    cui,
    cucMessage,
    cucNavigation,
    cucProducts,
  ]);

export default moduleName;
