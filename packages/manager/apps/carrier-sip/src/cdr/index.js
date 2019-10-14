import angular from 'angular';

// Module dependencies.
import uiRouter from '@uirouter/angularjs';

// Routing and configuration.
import routing from './routing';

const moduleName = 'carrierSipAppCdr';

angular
  .module(moduleName, [
    uiRouter,
  ])
  .config(routing);

export default moduleName;
