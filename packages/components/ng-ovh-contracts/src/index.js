import angular from 'angular';

import full from './full';
import summary from './summary';

const moduleName = 'ngOvhContracts';

angular
  .module(moduleName, [
    full,
    summary,
  ]);

export default moduleName;
