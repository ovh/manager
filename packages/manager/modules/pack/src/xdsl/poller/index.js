import angular from 'angular';
import 'ovh-api-services';

import service from './service';

const moduleName = 'ovhManagerPackXdslPoller';

angular
  .module(moduleName, [
    'ovh-api-services',
  ])
  .service('XdslTaskPoller', service);

export default moduleName;
