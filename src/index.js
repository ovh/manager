import angular from 'angular';

import cui from './cui';
import cucMessage from './message';
import cucProducts from './products';

const moduleName = 'ngOvhCloudUniverseComponents';

angular
  .module(moduleName, [
    cui,
    cucMessage,
    cucProducts,
  ]);

export default moduleName;
