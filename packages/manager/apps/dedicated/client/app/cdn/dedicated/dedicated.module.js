import angular from 'angular';
import '@uirouter/angularjs';

import routing from './cdn-dedicated.routes';
import service from './cdn-dedicated.service';

import manageModule from './manage';
import backendOrderModule from './backend/order';
import quotaOrderModule from './quota/order';

const moduleName = 'ovhManagerCdnDedicated';

angular
  .module(moduleName, [
    'ui.router',
    manageModule,
    backendOrderModule,
    quotaOrderModule,
  ])
  .config(routing)
  .service('Cdn', service);

export default moduleName;
