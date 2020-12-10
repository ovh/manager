import billing from '@ovh-ux/manager-billing';
import routing from './termination.routing';

import legacyService from './legacy/termination-legacy.service';

const moduleName = 'ovhManagerBillingTermination';

angular
  .module(moduleName, ['ui.router', billing])
  .config(routing)
  .service('BillingTerminateLegacy', legacyService);

export default moduleName;
