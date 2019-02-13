import angular from 'angular';

import cui from './cui';
import cucProducts from './products';

const moduleName = 'ngOvhCloudUniverseComponents';

angular
  .module(moduleName, [
    cui,
    cucProducts,
  ]);

export default moduleName;
