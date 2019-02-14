import angular from 'angular';

import cui from './cui';
import cucMessage from './message';
import cucNavigation from './navigation';
import cucPoll from './poll';
import cucProducts from './products';

const moduleName = 'ngOvhCloudUniverseComponents';

angular
  .module(moduleName, [
    cui,
    cucMessage,
    cucNavigation,
    cucPoll,
    cucProducts,
  ]);

export default moduleName;
