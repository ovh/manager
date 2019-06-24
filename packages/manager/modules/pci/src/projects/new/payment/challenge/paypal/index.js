import angular from 'angular';
import '@uirouter/angularjs';

import routing from './paypal.routing';

const moduleName = 'ovhManagerPciProjectsNewPaymentChallengePaypal';

angular
  .module(moduleName, [
    'ui.router',
  ])
  .config(routing);

export default moduleName;
