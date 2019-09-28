import angular from 'angular';

// Peer dependencies.
import '@ovh-ux/manager-core';
import 'ovh-api-services';

// Module dependencies.
import cdr from './cdr';
import dashboard from './dashboard';
import endpoints from './endpoints';

// Services.
import service from './carrier-sip.service';

const moduleName = 'ovhManagerCarrierSip';

angular
  .module(moduleName, [
    cdr,
    dashboard,
    endpoints,
    'ovh-api-services',
    'ovhManagerCore',
  ])
  .service('CarrierSipService', service);

export default moduleName;
