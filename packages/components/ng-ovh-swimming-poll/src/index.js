import angular from 'angular';

import service from './service';

const moduleName = 'ngOvhSwimmingPoll';

angular
  .module(moduleName, [])
  .service('Poller', service);

export default moduleName;
